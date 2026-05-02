"use client";

import { useEffect, useState } from "react";
import { fetchServices } from "@/lib/api";
import Link from "next/link";
import type { Service } from "@/lib/api";

const CATS: Record<string, { title: string; icon: string }> = {
  extension: { title: "Наращивание", icon: "✦" },
  claws: { title: "Когти", icon: "◇" },
  coverage: { title: "Покрытие", icon: "◧" },
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  const grouped = Object.entries(CATS).map(([key, cat]) => ({
    ...cat,
    key,
    services: services.filter((s) => s.category === key),
  }));

  const displayed = active ? grouped.filter((g) => g.key === active) : grouped;

  return (
    <div className="px-5 pt-6 pb-24">
      <h1 className="text-xl font-light tracking-wide mb-1">
        <span className="text-[var(--color-accent)]">Услуги</span>
      </h1>
      <p className="text-[var(--color-text-muted)] text-xs mb-6">
        Выберите категорию или услугу для записи
      </p>

      {/* FILTER CHIPS */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActive(null)}
          className={`badge whitespace-nowrap transition-all ${
            !active ? "!bg-[var(--color-accent-glow)] !border-[var(--color-accent)]/30 !text-[var(--color-accent-2)]" : ""
          }`}
        >
          Все
        </button>
        {grouped.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key)}
            className={`badge whitespace-nowrap transition-all ${
              active === cat.key
                ? "!bg-[var(--color-accent-glow)] !border-[var(--color-accent)]/30 !text-[var(--color-accent-2)]"
                : ""
            }`}
          >
            {cat.icon} {cat.title}
          </button>
        ))}
      </div>

      {/* SERVICE CARDS */}
      {displayed.map((cat) => (
        <div key={cat.key} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">{cat.icon}</span>
            <span className="section-label">{cat.title}</span>
          </div>
          <div className="space-y-3">
            {cat.services.map((svc) => (
              <Link href={`/booking?service=${svc.id}`} key={svc.id}>
                <div className="card p-5 flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-[14px] font-medium">{svc.name}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                      {cat.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="price-tag text-[14px]">
                      {svc.price.toLocaleString()}₽
                    </span>
                    <span className="text-[var(--color-text-muted)] text-xs">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
