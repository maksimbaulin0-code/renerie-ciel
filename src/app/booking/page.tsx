"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchServices, fetchSlots } from "@/lib/api";
import { sendTGData } from "@/lib/tg";
import type { Service, Slot } from "@/lib/api";

const CATEGORIES: Record<string, { title: string; icon: string }> = {
  extension: { title: "Наращивание", icon: "📏" },
  claws: { title: "Когти", icon: "🦅" },
  coverage: { title: "Покрытие", icon: "💅" },
};

type Step = "service" | "slot" | "details";

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("service");
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [comment, setComment] = useState("");
  const [photoWish, setPhotoWish] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  useEffect(() => {
    if (selectedService) {
      fetchSlots().then(setSlots);
    }
  }, [selectedService]);

  const grouped = Object.entries(CATEGORIES).map(([key, cat]) => ({
    ...cat,
    key,
    services: services.filter((s) => s.category === key),
  }));

  const handleBook = async () => {
    if (!selectedService || !selectedSlot) return;
    setLoading(true);
    await sendTGData({
      action: "book",
      service_id: selectedService.id,
      slot_id: selectedSlot.id,
      comment,
      photo_wish: photoWish,
    });
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-xl font-light tracking-wide mb-6">
        <span className="text-[var(--accent)]">Запись</span>
      </h1>

      <div className="flex justify-center gap-2 mb-8">
        {(["service", "slot", "details"] as Step[]).map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-all ${
              step === s
                ? "bg-[var(--accent)] w-6"
                : "bg-white/20"
            }`}
          />
        ))}
      </div>

      {step === "service" && (
        <div>
          <p className="text-sm text-white/40 mb-4">Выберите услугу</p>
          {grouped.map((cat) => (
            <div key={cat.key} className="mb-5">
              <h3 className="text-xs font-medium text-white/30 uppercase tracking-widest mb-2">
                {cat.icon} {cat.title}
              </h3>
              <div className="space-y-2">
                {cat.services.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => {
                      setSelectedService(svc);
                      setStep("slot");
                    }}
                    className={`glass-card glass-card-hover p-4 w-full flex justify-between items-center text-left ${
                      selectedService?.id === svc.id
                        ? "border-[var(--accent)]/40"
                        : ""
                    }`}
                  >
                    <span className="text-sm text-white/80">{svc.name}</span>
                    <span className="text-sm font-medium text-[var(--accent)]">
                      {svc.price.toLocaleString()}₽
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {step === "slot" && (
        <div>
          <button
            onClick={() => setStep("service")}
            className="text-[var(--accent)] text-sm mb-4"
          >
            ← Назад
          </button>

          <div className="glass-card p-3 mb-4 flex justify-between items-center">
            <span className="text-sm text-white/70">
              {selectedService?.name}
            </span>
            <span className="text-sm font-medium text-[var(--accent)]">
              {selectedService?.price.toLocaleString()}₽
            </span>
          </div>

          <p className="text-sm text-white/40 mb-3">Выберите время</p>
          {slots.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <p className="text-white/40 text-sm">
                Свободных окошек нет. Загляните позже!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setStep("details");
                  }}
                  className={`glass-card glass-card-hover p-4 w-full text-left ${
                    selectedSlot?.id === slot.id
                      ? "border-[var(--accent)]/40"
                      : ""
                  }`}
                >
                  <span className="text-sm">
                    📅 {slot.date} в {slot.time}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === "details" && (
        <div>
          <button
            onClick={() => setStep("slot")}
            className="text-[var(--accent)] text-sm mb-4"
          >
            ← Назад
          </button>

          <div className="glass-card p-3 mb-4 space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-white/70">
                {selectedService?.name}
              </span>
              <span className="text-sm font-medium text-[var(--accent)]">
                {selectedService?.price.toLocaleString()}₽
              </span>
            </div>
            <p className="text-xs text-white/40">
              📅 {selectedSlot?.date} в {selectedSlot?.time}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/40 mb-2 block">
                💬 Пожелания к дизайну
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Опишите желаемый дизайн, форму, цвет..."
                rows={3}
                className="resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-white/40 mb-2 block">
                📸 Фото-референс
              </label>
              <div className="glass-card p-6 text-center cursor-pointer glass-card-hover">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPhotoWish(file.name);
                    }
                  }}
                />
                <label htmlFor="photo-upload" className="cursor-pointer block">
                  <span className="text-2xl block mb-1">📷</span>
                  <span className="text-xs text-white/40">
                    {photoWish || "Прикрепить фото-референс"}
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={loading}
              className="btn-primary mt-4"
            >
              {loading ? "Запись..." : "✨ Записаться"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
