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
  const [editingPrice, setEditingPrice] = useState<Record<number, string>>({});
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
    const newPrice = parseInt(editingPrice[id]);
    if (!newPrice) return;
    await updatePrice(id, newPrice);
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price: newPrice } : s))
    );
    setEditingPrice((prev) => {
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
        <p className="text-white/30 text-sm">Проверка доступа...</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-xl font-light tracking-wide mb-6">
        <span className="text-[var(--accent)]">Панель мастера</span>
      </h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("services")}
          className={`glass-card px-4 py-2 text-xs font-medium ${
            tab === "services"
              ? "border-[var(--accent)]/40 text-[var(--accent)]"
              : "text-white/50"
          }`}
        >
          Услуги
        </button>
        <button
          onClick={() => setTab("slots")}
          className={`glass-card px-4 py-2 text-xs font-medium ${
            tab === "slots"
              ? "border-[var(--accent)]/40 text-[var(--accent)]"
              : "text-white/50"
          }`}
        >
          Слоты
        </button>
      </div>

      {tab === "services" && (
        <div className="space-y-2">
          {services.map((svc) => (
            <div key={svc.id} className="glass-card p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-white/80">{svc.name}</p>
                  <p className="text-xs text-white/30 mt-0.5">{svc.category}</p>
                </div>
                {editingPrice[svc.id] !== undefined ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editingPrice[svc.id]}
                      onChange={(e) =>
                        setEditingPrice((prev) => ({
                          ...prev,
                          [svc.id]: e.target.value,
                        }))
                      }
                      className="w-20 text-right text-sm !py-1.5 !px-2"
                    />
                    <button
                      onClick={() => handlePriceSave(svc.id)}
                      className="text-[var(--accent)] text-xs font-medium"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      setEditingPrice((prev) => ({
                        ...prev,
                        [svc.id]: String(svc.price),
                      }))
                    }
                    className="text-sm font-medium text-[var(--accent)]"
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
          {slots.map((slot) => (
            <div key={slot.id} className="glass-card p-4 flex justify-between items-center">
              <span className="text-sm">
                📅 {slot.date} в {slot.time}
              </span>
              <button
                onClick={() => handleDeleteSlot(slot.id)}
                className="text-red-400/70 text-xs font-medium"
              >
                Удалить
              </button>
            </div>
          ))}
          {slots.length === 0 && (
            <div className="glass-card p-6 text-center">
              <p className="text-white/30 text-sm">
                Нет свободных слотов. Добавьте через бот.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
