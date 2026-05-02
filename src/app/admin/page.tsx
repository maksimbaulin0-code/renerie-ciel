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
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    (async () => {
      if (!(await isTGAdmin())) { router.push("/"); return; }
      setAuth(true);
      const [s, sl] = await Promise.all([fetchServices(), fetchSlots()]);
      setServices(s);
      setSlots(sl);
    })();
  }, []);

  const savePrice = async (id: number) => {
    const p = parseInt(editing[id]);
    if (!p) return;
    await updatePrice(id, p);
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, price: p } : s)));
    setEditing((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const removeSlot = async (id: number) => {
    await deleteSlot(id);
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  if (!auth) return <div className="flex items-center justify-center min-h-screen"><p className="text-white/20 text-sm">...</p></div>;

  return (
    <div className="px-5 pt-10 pb-24">
      <h1 className="text-[20px] font-light tracking-wide mb-8">Мастер</h1>

      <div className="flex gap-3 mb-8">
        <button onClick={() => setTab("services")} className={`text-[12px] tracking-wide ${tab === "services" ? "text-white" : "text-white/20"}`}>
          Прайс
        </button>
        <button onClick={() => setTab("slots")} className={`text-[12px] tracking-wide ${tab === "slots" ? "text-white" : "text-white/20"}`}>
          Слоты
        </button>
      </div>

      {tab === "services" && (
        <div>
          {services.map((svc) => (
            <div key={svc.id} className="flex justify-between items-center py-3 border-b border-white/[0.04]">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-[13px] truncate">{svc.name}</p>
              </div>
              {editing[svc.id] !== undefined ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editing[svc.id]}
                    onChange={(e) => setEditing((p) => ({ ...p, [svc.id]: e.target.value }))}
                    className="field !w-16 !py-1.5 !px-2 text-right text-[13px]"
                    autoFocus
                  />
                  <button onClick={() => savePrice(svc.id)} className="text-white/50 text-[13px]">✓</button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing((p) => ({ ...p, [svc.id]: String(svc.price) }))}
                  className="text-[13px] text-white/40"
                >
                  {svc.price.toLocaleString()}₽
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "slots" && (
        <div>
          {slots.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-white/20 text-sm">Нет слотов</p>
            </div>
          ) : (
            slots.map((slot) => (
              <div key={slot.id} className="flex justify-between items-center py-3 border-b border-white/[0.04]">
                <span className="text-[13px]">{slot.date} в {slot.time}</span>
                <button onClick={() => removeSlot(slot.id)} className="text-[11px] text-white/20">Удалить</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
