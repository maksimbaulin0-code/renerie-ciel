"use client";

import { useEffect, useState } from "react";
import { fetchServices } from "@/lib/api";
import type { Service } from "@/lib/api";

const CATEGORIES: Record<string, { title: string; icon: string }> = {
  extension: { title: "Наращивание", icon: "📏" },
  claws: { title: "Когти", icon: "🦅" },
  coverage: { title: "Покрытие", icon: "💅" },
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  const grouped = Object.entries(CATEGORIES).map(([key, cat]) => ({
    ...cat,
    key,
    services: services.filter((s) => s.category === key),
  }));

  const displayed = activeCategory
    ? grouped.filter((g) => g.key === activeCategory)
    : grouped;

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-xl font-light tracking-wide mb-4">
        <span className="text-[var(--accent)]">Услуги</span>
      </h1>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveCategory(null)}
          className={`glass-card px-4 py-2 text-xs font-medium whitespace-nowrap transition-all ${
            !activeCategory
              ? "border-[var(--accent)]/40 text-[var(--accent)]"
              : "text-white/50"
          }`}
        >
          Все
        </button>
        {grouped.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`glass-card px-4 py-2 text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.key
                ? "border-[var(--accent)]/40 text-[var(--accent)]"
                : "text-white/50"
            }`}
          >
            {cat.icon} {cat.title}
          </button>
        ))}
      </div>

      {displayed.map((cat) => (
        <div key={cat.key} className="mb-6">
          <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-3">
            {cat.icon} {cat.title}
          </h2>
          <div className="space-y-2">
            {cat.services.map((svc) => (
              <div
                key={svc.id}
                className="glass-card glass-card-hover p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-white/90">{svc.name}</p>
                  <p className="text-xs text-white/30 mt-0.5">{cat.title}</p>
                </div>
                <span className="text-base font-semibold text-[var(--accent)]">
                  {svc.price.toLocaleString()}₽
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
