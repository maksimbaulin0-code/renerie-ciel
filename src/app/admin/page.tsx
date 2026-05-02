"use client";

import { useEffect, useState } from "react";
import {
  fetchServices,
  fetchAllSlots,
  fetchBookings,
  updatePrice,
  addSlot,
  deleteSlot,
  addService,
  deleteService,
} from "@/lib/api";
import type { Service, Slot, Booking } from "@/lib/api";

const CATS = [
  { value: "extension", label: "Наращивание" },
  { value: "claws", label: "Когти" },
  { value: "coverage", label: "Покрытие" },
];

type Tab = "bookings" | "slots" | "services";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("bookings");
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editing, setEditing] = useState<Record<number, string>>({});

  // slot form
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");

  // service form
  const [svcName, setSvcName] = useState("");
  const [svcPrice, setSvcPrice] = useState("");
  const [svcCat, setSvcCat] = useState("extension");

  const loadAll = async () => {
    const [s, sl, b] = await Promise.all([fetchServices(), fetchAllSlots(), fetchBookings()]);
    setServices(s);
    setSlots(sl);
    setBookings(b);
  };

  useEffect(() => { loadAll(); }, []);

  // --- SLOT ---
  const handleAddSlot = async () => {
    if (!slotDate || !slotTime) return;
    await addSlot(slotDate, slotTime);
    setSlotDate("");
    setSlotTime("");
    loadAll();
  };

  const handleDeleteSlot = async (id: number) => {
    await deleteSlot(id);
    loadAll();
  };

  // --- SERVICE ---
  const handleAddService = async () => {
    if (!svcName || !svcPrice) return;
    await addService(svcName, parseInt(svcPrice), svcCat);
    setSvcName("");
    setSvcPrice("");
    loadAll();
  };

  const handleDeleteService = async (id: number) => {
    await deleteService(id);
    loadAll();
  };

  const handleSavePrice = async (id: number) => {
    const p = parseInt(editing[id]);
    if (!p) return;
    await updatePrice(id, p);
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, price: p } : s)));
    setEditing((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "bookings", label: "Записи" },
    { key: "slots", label: "Слоты" },
    { key: "services", label: "Прайс" },
  ];

  return (
    <div className="px-5 pt-10 pb-24">
      <h1 className="text-[20px] font-light tracking-wide mb-8">Мастер</h1>

      {/* TABS */}
      <div className="flex gap-5 mb-8 border-b border-white/[0.06] pb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-[12px] tracking-wide pb-1 border-b-2 transition-colors ${
              tab === t.key ? "text-white border-white" : "text-white/20 border-transparent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* BOOKINGS */}
      {tab === "bookings" && (
        <div>
          {bookings.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-white/20 text-sm">Нет записей</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="py-4 border-b border-white/[0.04]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[13px] font-medium">{b.name} — {b.price}₽</span>
                  </div>
                  <p className="text-[12px] text-white/30">{b.date} в {b.time}</p>
                  {b.comment && <p className="text-[12px] text-white/40 mt-1">💬 {b.comment}</p>}
                  {b.photo_wish && <p className="text-[12px] text-white/40 mt-0.5">📸 Референс прикреплён</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SLOTS */}
      {tab === "slots" && (
        <div>
          {/* ADD FORM */}
          <div className="flex gap-2 mb-6">
            <input
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
              placeholder="Дата"
              className="field flex-1"
            />
            <input
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              placeholder="Время"
              className="field !w-24"
            />
            <button onClick={handleAddSlot} className="btn-book !w-auto !px-4 !py-3 text-[13px]">
              +
            </button>
          </div>

          {/* LIST */}
          {slots.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-white/20 text-sm">Нет слотов</p>
            </div>
          ) : (
            <div>
              {slots.map((slot) => (
                <div key={slot.id} className="flex justify-between items-center py-3 border-b border-white/[0.04]">
                  <div>
                    <span className="text-[13px]">{slot.date}</span>
                    <span className="text-[13px] text-white/30 ml-2">{slot.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] ${slot.status === "free" ? "text-green-400/50" : "text-white/20"}`}>
                      {slot.status === "free" ? "свободен" : "занят"}
                    </span>
                    <button onClick={() => handleDeleteSlot(slot.id)} className="text-[11px] text-white/20 hover:text-white/40">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SERVICES */}
      {tab === "services" && (
        <div>
          {/* ADD FORM */}
          <div className="mb-6 space-y-2">
            <input
              value={svcName}
              onChange={(e) => setSvcName(e.target.value)}
              placeholder="Название услуги"
              className="field"
            />
            <div className="flex gap-2">
              <input
                value={svcPrice}
                onChange={(e) => setSvcPrice(e.target.value)}
                placeholder="Цена"
                type="number"
                className="field !w-28"
              />
              <select
                value={svcCat}
                onChange={(e) => setSvcCat(e.target.value)}
                className="field flex-1"
              >
                {CATS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <button onClick={handleAddService} className="btn-book !w-auto !px-4 !py-3 text-[13px]">
                +
              </button>
            </div>
          </div>

          {/* LIST */}
          {services.map((svc) => (
            <div key={svc.id} className="flex justify-between items-center py-3 border-b border-white/[0.04]">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-[13px] truncate">{svc.name}</p>
                <p className="text-[10px] text-white/20">
                  {CATS.find((c) => c.value === svc.category)?.label || svc.category}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {editing[svc.id] !== undefined ? (
                  <>
                    <input
                      type="number"
                      value={editing[svc.id]}
                      onChange={(e) => setEditing((p) => ({ ...p, [svc.id]: e.target.value }))}
                      className="field !w-16 !py-1.5 !px-2 text-right text-[13px]"
                      autoFocus
                    />
                    <button onClick={() => handleSavePrice(svc.id)} className="text-white/50 text-[13px]">✓</button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing((p) => ({ ...p, [svc.id]: String(svc.price) }))}
                    className="text-[13px] text-white/40"
                  >
                    {svc.price.toLocaleString()}₽
                  </button>
                )}
                <button onClick={() => handleDeleteService(svc.id)} className="text-[11px] text-white/20 ml-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
