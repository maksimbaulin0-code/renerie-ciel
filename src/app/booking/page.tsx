"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchServices, fetchSlots } from "@/lib/api";
import { sendTGData } from "@/lib/tg";
import type { Service, Slot } from "@/lib/api";

type Step = "service" | "slot" | "details";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service");

  const [step, setStep] = useState<Step>("service");
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [sel, setSel] = useState<Service | null>(null);
  const [selSlot, setSelSlot] = useState<Slot | null>(null);
  const [comment, setComment] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetchServices().then((svcs) => {
      setServices(svcs);
      if (preselected) {
        const found = svcs.find((s) => s.id === Number(preselected));
        if (found) {
          setSel(found);
          setStep("slot");
          fetchSlots().then(setSlots);
        }
      }
    });
  }, [preselected]);

  useEffect(() => {
    if (sel && !preselected) fetchSlots().then(setSlots);
  }, [sel]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoFile(f);
    const r = new FileReader();
    r.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const handleBook = async () => {
    if (!sel || !selSlot) return;
    setLoading(true);
    await sendTGData({
      action: "book",
      service_id: sel.id,
      slot_id: selSlot.id,
      comment: comment.trim(),
      photo_wish: photoFile ? photoFile.name : "",
    });
    setLoading(false);
    setDone(true);
  };

  const STEP_MAP: Record<Step, string> = {
    service: "Услуга",
    slot: "Время",
    details: "Детали",
  };

  if (done) {
    return (
      <div className="px-5 pt-20 pb-24 text-center">
        <p className="text-[24px] font-light mb-3">Готово</p>
        <p className="text-white/50 text-sm">{sel?.name}</p>
        <p className="text-white/50 text-sm">
          {selSlot?.date} в {selSlot?.time}
        </p>
        <p className="text-sm font-medium mt-4">{sel?.price.toLocaleString()}₽</p>
        <button onClick={() => router.push("/")} className="btn-book mt-8 max-w-[200px] mx-auto">
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-10 pb-24">
      {/* STEPS */}
      <div className="flex items-center gap-3 mb-8">
        {(Object.keys(STEP_MAP) as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            {i > 0 && <div className={`w-4 h-px ${step === s ? "bg-white/30" : "bg-white/8"}`} />}
            <span className={`text-[11px] tracking-wide ${step === s ? "text-white" : "text-white/20"}`}>
              {STEP_MAP[s]}
            </span>
          </div>
        ))}
      </div>

      {/* SERVICE */}
      {step === "service" && (
        <div>
          {services.map((svc) => (
            <button
              key={svc.id}
              onClick={() => { setSel(svc); setStep("slot"); }}
              className={`w-full flex justify-between items-center py-4 border-b border-white/[0.04] text-left ${
                sel?.id === svc.id ? "text-white" : "text-white/60"
              }`}
            >
              <span className="text-[14px]">{svc.name}</span>
              <span className="text-[13px] text-white/40">{svc.price.toLocaleString()}₽</span>
            </button>
          ))}
        </div>
      )}

      {/* SLOT */}
      {step === "slot" && (
        <div>
          <button onClick={() => setStep("service")} className="text-white/30 text-sm mb-6">← Назад</button>

          {sel && (
            <div className="flex justify-between items-center py-3 mb-6 border-b border-white/[0.08]">
              <span className="text-[14px]">{sel.name}</span>
              <span className="text-[13px]">{sel.price.toLocaleString()}₽</span>
            </div>
          )}

          {slots.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-white/25 text-sm">Свободных окошек нет</p>
            </div>
          ) : (
            slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => { setSelSlot(slot); setStep("details"); }}
                className="w-full flex justify-between items-center py-4 border-b border-white/[0.04] text-left"
              >
                <span className="text-[14px]">{slot.date}</span>
                <span className="text-[13px] text-white/40">{slot.time}</span>
              </button>
            ))
          )}
        </div>
      )}

      {/* DETAILS */}
      {step === "details" && (
        <div>
          <button onClick={() => setStep("slot")} className="text-white/30 text-sm mb-6">← Назад</button>

          <div className="flex justify-between items-center py-3 mb-6 border-b border-white/[0.08]">
            <div>
              <p className="text-[14px]">{sel?.name}</p>
              <p className="text-[12px] text-white/30">{selSlot?.date} в {selSlot?.time}</p>
            </div>
            <span className="text-[13px]">{sel?.price.toLocaleString()}₽</span>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-[11px] tracking-wide text-white/25 mb-2">Пожелания</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Опишите желаемый дизайн..."
                rows={3}
                className="field"
              />
            </div>

            <div>
              <p className="text-[11px] tracking-wide text-white/25 mb-2">Фото-референс</p>
              {photoPreview ? (
                <div className="relative">
                  <img src={photoPreview} alt="" className="w-full h-40 object-cover rounded-xl" />
                  <button
                    onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white/60 text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="card p-8 flex flex-col items-center cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  <span className="text-white/20 text-sm">Прикрепить фото</span>
                </label>
              )}
            </div>

            <button onClick={handleBook} disabled={loading} className="btn-book mt-4">
              {loading ? "..." : "Записаться"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="px-5 pt-10 pb-24"><p className="text-white/20 text-sm">Загрузка...</p></div>}>
      <BookingContent />
    </Suspense>
  );
}
