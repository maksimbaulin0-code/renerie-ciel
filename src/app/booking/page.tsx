"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchServices, fetchSlots } from "@/lib/api";
import { sendTGData } from "@/lib/tg";
import type { Service, Slot } from "@/lib/api";

const CATS: Record<string, { title: string; icon: string }> = {
  extension: { title: "Наращивание", icon: "✦" },
  claws: { title: "Когти", icon: "◇" },
  coverage: { title: "Покрытие", icon: "◧" },
};

type Step = "service" | "slot" | "details";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get("service");

  const [step, setStep] = useState<Step>("service");
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<Service | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [comment, setComment] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchServices().then((svcs) => {
      setServices(svcs);
      if (preselectedServiceId) {
        const found = svcs.find((s) => s.id === Number(preselectedServiceId));
        if (found) {
          setSelected(found);
          setStep("slot");
          fetchSlots().then(setSlots);
        }
      }
    });
  }, [preselectedServiceId]);

  useEffect(() => {
    if (selected && !preselectedServiceId) {
      fetchSlots().then(setSlots);
    }
  }, [selected]);

  const grouped = Object.entries(CATS).map(([key, cat]) => ({
    ...cat,
    key,
    services: services.filter((s) => s.category === key),
  }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleBook = async () => {
    if (!selected || !selectedSlot) return;
    setLoading(true);

    let photoWish = "";
    if (photoFile) {
      photoWish = photoFile.name;
    }

    await sendTGData({
      action: "book",
      service_id: selected.id,
      slot_id: selectedSlot.id,
      comment: comment.trim(),
      photo_wish: photoWish,
    });

    setLoading(false);
    setSuccess(true);
  };

  const stepLabels = { service: "Услуга", slot: "Время", details: "Детали" };

  if (success) {
    return (
      <div className="px-5 pt-14 pb-24 text-center">
        <div className="text-5xl mb-4">✦</div>
        <h1 className="text-xl font-light mb-2">Запись оформлена!</h1>
        <p className="text-[var(--color-text-dim)] text-sm mb-1">
          {selected?.name}
        </p>
        <p className="text-[var(--color-text-dim)] text-sm mb-1">
          📅 {selectedSlot?.date} в {selectedSlot?.time}
        </p>
        <p className="text-[var(--color-accent)] text-sm font-medium mt-4">
          {selected?.price.toLocaleString()}₽
        </p>
        <button
          onClick={() => router.push("/")}
          className="btn btn-primary mt-8 max-w-xs mx-auto"
        >
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-24">
      {/* HEADER */}
      <h1 className="text-xl font-light tracking-wide mb-1">
        <span className="text-[var(--color-accent)]">Запись</span>
      </h1>

      {/* STEP INDICATOR */}
      <div className="flex items-center gap-2 mt-4 mb-8">
        {(Object.keys(stepLabels) as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && (
              <div className={`w-6 h-[1px] ${step === s ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"}`} />
            )}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                step === s
                  ? "bg-[var(--color-accent-glow)] text-[var(--color-accent-2)] border border-[var(--color-accent)]/20"
                  : "text-[var(--color-text-muted)]"
              }`}
            >
              {stepLabels[s]}
            </div>
          </div>
        ))}
      </div>

      {/* STEP 1: SERVICE */}
      {step === "service" && (
        <div className="space-y-6">
          {grouped.map((cat) => (
            <div key={cat.key}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">{cat.icon}</span>
                <span className="section-label">{cat.title}</span>
              </div>
              <div className="space-y-2">
                {cat.services.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => {
                      setSelected(svc);
                      setStep("slot");
                    }}
                    className={`card w-full p-4 flex justify-between items-center text-left ${
                      selected?.id === svc.id ? "card-active" : ""
                    }`}
                  >
                    <span className="text-[13px]">{svc.name}</span>
                    <span className="price-tag">
                      {svc.price.toLocaleString()}₽
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 2: SLOT */}
      {step === "slot" && (
        <div>
          <button
            onClick={() => setStep("service")}
            className="text-[var(--color-accent)] text-sm mb-5 flex items-center gap-1"
          >
            ← Назад
          </button>

          {selected && (
            <div className="card card-active p-4 mb-6 flex justify-between items-center">
              <span className="text-sm">{selected.name}</span>
              <span className="price-tag">{selected.price.toLocaleString()}₽</span>
            </div>
          )}

          <p className="section-label mb-4">Свободные окошки</p>
          {slots.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-[var(--color-text-muted)] text-sm">
                Свободных окошек сейчас нет
              </p>
              <p className="text-[var(--color-text-muted)] text-xs mt-1">
                Загляните позже или напишите мастеру
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
                  className={`card w-full p-4 flex items-center gap-3 text-left ${
                    selectedSlot?.id === slot.id ? "card-active" : ""
                  }`}
                >
                  <span className="text-lg">📅</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{slot.date}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{slot.time}</p>
                  </div>
                  <span className="text-[var(--color-text-muted)] text-xs">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: DETAILS */}
      {step === "details" && (
        <div>
          <button
            onClick={() => setStep("slot")}
            className="text-[var(--color-accent)] text-sm mb-5 flex items-center gap-1"
          >
            ← Назад
          </button>

          {/* SUMMARY CARD */}
          <div className="card card-active p-5 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{selected?.name}</span>
              <span className="price-tag text-[14px]">
                {selected?.price.toLocaleString()}₽
              </span>
            </div>
            <div className="divider my-3" />
            <div className="flex items-center gap-2">
              <span className="text-xs">📅</span>
              <span className="text-xs text-[var(--color-text-dim)]">
                {selectedSlot?.date} в {selectedSlot?.time}
              </span>
            </div>
          </div>

          {/* WISHES */}
          <div className="space-y-4">
            <div>
              <label className="section-label block mb-2">
                💬 Пожелания к дизайну
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Опишите желаемый дизайн, форму, цвет..."
                rows={3}
                className="field"
              />
            </div>

            <div>
              <label className="section-label block mb-2">
                📸 Фото-референс
              </label>
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Референс"
                    className="w-full h-48 object-cover rounded-2xl border border-[var(--color-border)]"
                  />
                  <button
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white text-sm flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="card p-6 flex flex-col items-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <span className="text-2xl mb-1">📷</span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    Прикрепить фото
                  </span>
                </label>
              )}
            </div>

            <button
              onClick={handleBook}
              disabled={loading}
              className="btn btn-primary mt-6"
            >
              {loading ? "Оформляем..." : "✦ Записаться"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="px-5 pt-6 pb-24"><p className="text-[var(--color-text-muted)] text-sm">Загрузка...</p></div>}>
      <BookingContent />
    </Suspense>
  );
}
