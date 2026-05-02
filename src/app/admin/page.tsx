"use client";

import { useEffect, useState } from "react";
import { fetchServices, fetchSlots, updatePrice, deleteSlot } from "@/lib/api";
import { isTGAdmin } from "@/lib/tg";
import { useRouter } from "next/navigation";
import type { Service, Slot } from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [editing, setEditing] = useState<Record<number, string>>({});
  const [tab, setTab] = useState<"services" | "slots">("services");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    (async () => {
      const admin = await isTGAdmin();
      if (!admin) {
        router.push("/");
        return;
      }
      setAuthorized(true);
      const [svc, sl] = await Promise.all([fetchServices(), fetchSlots()]);
      setServices(svc);
      setSlots(sl);
    })();
  }, []);

  const handlePriceSave = async (id: number) => {
    const newPrice = parseInt(editing[id]);
    if (!newPrice) return;
    await updatePrice(id, newPrice);
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price: newPrice } : s))
    );
    setEditing((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleDeleteSlot = async (id: number) => {
    await deleteSlot(id);
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--color-text-muted)] text-sm">Проверка доступа...</p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-24">
      <h1 className="text-xl font-light tracking-wide mb-1">
        <span className="text-[var(--color-gold)]">Панель мастера</span>
      </h1>
      <p className="text-[var(--color-text-muted)] text-xs mb-6">
        Управление услугами и записями
      </p>

      {/* TABS */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("services")}
          className={`badge transition-all ${
            tab === "services"
              ? "!bg-[var(--color-accent-glow)] !border-[var(--color-accent)]/30 !text-[var(--color-accent-2)]"
              : ""
          }`}
        >
          Услуги ({services.length})
        </button>
        <button
          onClick={() => setTab("slots")}
          className={`badge transition-all ${
            tab === "slots"
              ? "!bg-[var(--color-accent-glow)] !border-[var(--color-accent)]/30 !text-[var(--color-accent-2)]"
              : ""
          }`}
        >
          Слоты ({slots.length})
        </button>
      </div>

      {tab === "services" && (
        <div className="space-y-2">
          {services.map((svc) => (
            <div key={svc.id} className="card p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium truncate">{svc.name}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                    {svc.category}
                  </p>
                </div>
                {editing[svc.id] !== undefined ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editing[svc.id]}
                      onChange={(e) =>
                        setEditing((prev) => ({ ...prev, [svc.id]: e.target.value }))
                      }
                      className="field !w-20 !py-2 !px-2 text-right text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => handlePriceSave(svc.id)}
                      className="text-[var(--color-accent)] text-sm font-bold"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      setEditing((prev) => ({ ...prev, [svc.id]: String(svc.price) }))
                    }
                    className="price-tag cursor-pointer"
                  >
                    {svc.price.toLocaleString()}₽
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "slots" && (
        <div className="space-y-2">
          {slots.length === 0 ? (
            <div className="card p-8 text-center">
              <span className="text-2xl opacity-20 block mb-2">📅</span>
              <p className="text-[var(--color-text-muted)] text-sm">
                Нет свободных слотов
              </p>
              <p className="text-[var(--color-text-muted)] text-xs mt-1">
                Добавьте через /admin в боте
              </p>
            </div>
          ) : (
            slots.map((slot) => (
              <div key={slot.id} className="card p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{slot.date}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{slot.time}</p>
                </div>
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="text-red-400/60 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-400/5 border border-red-400/10"
                >
                  Удалить
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
