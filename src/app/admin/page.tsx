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
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // slot form
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");

  // service form
  const [svcName, setSvcName] = useState("");
  const [svcPrice, setSvcPrice] = useState("");
  const [svcCat, setSvcCat] = useState("extension");

  const loadAll = async () => {
    setErr("");
    try {
      const [s, sl, b] = await Promise.all([
        fetchServices(),
        fetchAllSlots(),
        fetchBookings(),
      ]);
      setServices(s);
      setSlots(sl);
      setBookings(b);
    } catch {
      setErr("Не удалось загрузить данные. Убедитесь, что бот запущен.");
    }
  };

  useEffect(() => {
    loadAll().finally(() => setLoading(false));
  }, []);

  // --- SLOT ---
  const handleAddSlot = async () => {
    if (!slotDate || !slotTime) return;
    setErr("");
    try {
      await addSlot(slotDate, slotTime);
      setSlotDate("");
      setSlotTime("");
      loadAll();
    } catch {
      setErr("Не удалось добавить слот");
    }
  };

  const handleDeleteSlot = async (id: number) => {
    try {
      await deleteSlot(id);
      loadAll();
    } catch {
      setErr("Не удалось удалить слот");
    }
  };

  // --- SERVICE ---
  const handleAddService = async () => {
    if (!svcName || !svcPrice) return;
    setErr("");
    try {
      await addService(svcName, parseInt(svcPrice), svcCat);
      setSvcName("");
      setSvcPrice("");
      loadAll();
    } catch {
      setErr("Не удалось добавить услугу");
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      await deleteService(id);
      loadAll();
    } catch {
      setErr("Не удалось удалить услугу");
    }
  };

  const handleSavePrice = async (id: number) => {
    const p = parseInt(editing[id]);
    if (!p) return;
    try {
      await updatePrice(id, p);
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, price: p } : s))
      );
      setEditing((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
    } catch {
      setErr("Не удалось обновить цену");
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "bookings", label: "Записи" },
    { key: "slots", label: "Слоты" },
    { key: "services", label: "Прайс" },
  ];

  return (
    <div className="px-5 pt-10 pb-24">
      <h1 className="text-[20px] font-light tracking-wide mb-2">Мастер</h1>
      <p className="text-white/20 text-[12px] mb-6">
        Управление студией
      </p>

      {err && (
        <div className="card p-4 mb-6 border-red-400/20">
          <p className="text-red-400/60 text-[13px]">{err}</p>
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-4 mb-8 border-b border-white/[0.04] pb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-[12px] tracking-wide pb-1 border-b-2 transition-colors ${
              tab === t.key
                ? "text-white border-white"
                : "text-white/20 border-transparent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white/[0.02] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* BOOKINGS */}
          {tab === "bookings" && (
            <div>
              {bookings.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-white/20 text-sm">Нет записей</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {bookings.map((b) => (
                    <div key={b.id} className="py-4 border-b border-white/[0.03]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[13px]">
                          {b.name} — {b.price}₽
                        </span>
                      </div>
                      <p className="text-[11px] text-white/25">
                        {b.date} в {b.time}
                      </p>
                      {b.comment && (
                        <p className="text-[11px] text-white/35 mt-1.5">
                          💬 {b.comment}
                        </p>
                      )}
                      {b.photo_wish && (
                        <p className="text-[11px] text-white/35 mt-0.5">
                          📸 Референс прикреплён
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SLOTS */}
          {tab === "slots" && (
            <div>
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
                <button
                  onClick={handleAddSlot}
                  className="btn-book !w-auto !px-4 !py-3"
                >
                  +
                </button>
              </div>

              {slots.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-white/20 text-sm">Нет слотов</p>
                  <p className="text-white/10 text-xs mt-1">
                    Добавьте через форму выше
                  </p>
                </div>
              ) : (
                <div>
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex justify-between items-center py-3.5 border-b border-white/[0.03]"
                    >
                      <div className="flex items-center gap-3">
                        {slot.status === "free" ? (
                          <span className="status-free" />
                        ) : (
                          <span className="status-booked" />
                        )}
                        <span className="text-[13px]">{slot.date}</span>
                        <span className="text-[12px] text-white/25">
                          {slot.time}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="text-[11px] text-white/15 hover:text-white/30 transition-colors px-2 py-1"
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SERVICES */}
          {tab === "services" && (
            <div>
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
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddService}
                    className="btn-book !w-auto !px-4 !py-3"
                  >
                    +
                  </button>
                </div>
              </div>

              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="flex justify-between items-center py-3.5 border-b border-white/[0.03]"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-[13px] truncate">{svc.name}</p>
                    <p className="text-[10px] text-white/15">
                      {CATS.find((c) => c.value === svc.category)?.label ||
                        svc.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {editing[svc.id] !== undefined ? (
                      <>
                        <input
                          type="number"
                          value={editing[svc.id]}
                          onChange={(e) =>
                            setEditing((p) => ({
                              ...p,
                              [svc.id]: e.target.value,
                            }))
                          }
                          className="field !w-16 !py-1.5 !px-2 text-right text-[13px]"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSavePrice(svc.id)}
                          className="text-white/40 text-[13px] px-2"
                        >
                          ✓
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          setEditing((p) => ({
                            ...p,
                            [svc.id]: String(svc.price),
                          }))
                        }
                        className="text-[13px] text-white/30"
                      >
                        {svc.price.toLocaleString()}₽
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteService(svc.id)}
                      className="text-[11px] text-white/10 hover:text-white/25 px-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
