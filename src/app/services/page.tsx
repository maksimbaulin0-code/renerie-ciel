"use client";

import { useEffect, useState } from "react";
import { fetchServices } from "@/lib/api";
import Link from "next/link";
import type { Service } from "@/lib/api";

const CATS: Record<string, { title: string; icon: string }> = {
  extension: { title: "Наращивание", icon: "━" },
  claws: { title: "Когти", icon: "◇" },
  coverage: { title: "Покрытие", icon: "○" },
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  const grouped = Object.entries(CATS).map(([key, meta]) => ({
    ...meta,
    key,
    items: services.filter((s) => s.category === key),
  }));

  const displayed = active ? grouped.filter((g) => g.key === active) : grouped;

  return (
    <div className="px-5 pt-10 pb-24">
      <h1 className="text-[20px] font-light tracking-wide mb-2">Прайс</h1>
      <p className="text-white/25 text-[12px] mb-8">
        Выберите услугу для записи
      </p>

      {/* CTA */}
      <Link href="/booking" className="block mb-10">
        <button className="btn-book">Записаться</button>
      </Link>

      {/* FILTER */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActive(null)}
          className={`tag ${!active ? "tag-active" : ""}`}
        >
          Все
        </button>
        {grouped.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key)}
            className={`tag ${active === cat.key ? "tag-active" : ""}`}
          >
            {cat.icon} {cat.title}
          </button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-white/[0.02] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        displayed.map((cat) => (
          <div key={cat.key} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white/25 text-xs">{cat.icon}</span>
              <span className="text-[11px] tracking-[0.12em] uppercase text-white/20">
                {cat.title}
              </span>
            </div>
            <div className="space-y-0">
              {cat.items.map((svc, i) => (
                <Link href={`/booking?service=${svc.id}`} key={svc.id}>
                  <div
                    className={`flex justify-between items-center py-4 ${
                      i < cat.items.length - 1
                        ? "border-b border-white/[0.03]"
                        : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-[14px]">{svc.name}</p>
                      <p className="text-[10px] text-white/20 mt-0.5">{cat.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="price">{svc.price.toLocaleString()}₽</span>
                      <span className="text-white/15 text-xs">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
