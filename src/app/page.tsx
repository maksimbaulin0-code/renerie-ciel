"use client";

import { useEffect, useState } from "react";
import { initTG, isTGAdmin } from "@/lib/tg";
import { fetchServices } from "@/lib/api";
import Link from "next/link";
import type { Service } from "@/lib/api";

const CATS: Record<string, { title: string; icon: string }> = {
  extension: { title: "Наращивание", icon: "━" },
  claws: { title: "Когти", icon: "◇" },
  coverage: { title: "Покрытие", icon: "○" },
};

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await initTG();
      setIsAdmin(await isTGAdmin());
      try {
        const svcs = await fetchServices();
        setServices(svcs);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const grouped = Object.entries(CATS).map(([key, meta]) => ({
    ...meta,
    key,
    items: services.filter((s) => s.category === key),
  }));

  return (
    <div className="pb-24">
      {/* HERO */}
      <div className="px-5 pt-14 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-px h-8 bg-white/10" />
          <div>
            <h1 className="text-[26px] font-light tracking-[0.18em] uppercase">
              Alimsa
            </h1>
            <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mt-1">
              nail studio
            </p>
          </div>
        </div>
        <p className="text-white/35 text-[13px] leading-relaxed max-w-[280px]">
          Маникюр и наращивание в Москве
        </p>
      </div>

      <div className="px-5">
        {/* CTA */}
        <Link href="/booking" className="block">
          <button className="btn-book">Записаться</button>
        </Link>
        <Link href="/services" className="block mt-3">
          <button className="btn-ghost text-white/40">Посмотреть прайс →</button>
        </Link>

        {isAdmin && (
          <Link href="/admin" className="block mt-4">
            <button className="btn-ghost text-white/25 text-[13px]">Панель мастера</button>
          </Link>
        )}

        <div className="sep my-10" />

        {/* CATEGORIES */}
        <div className="grid grid-cols-3 gap-2 mb-10">
          {grouped.map((cat) => (
            <Link href="/services" key={cat.key}>
              <div className="card p-4 text-center">
                <span className="text-lg block mb-1.5 opacity-40">{cat.icon}</span>
                <span className="text-[11px] text-white/50">{cat.title}</span>
                <span className="text-[10px] text-white/20 block mt-0.5">
                  от {Math.min(...cat.items.map((s) => s.price)).toLocaleString()}₽
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="sep mb-10" />

        {/* PRICE LIST */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-white/[0.02] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div>
            <p className="text-[11px] tracking-[0.15em] uppercase text-white/20 mb-5">
              Прайс-лист
            </p>
            {grouped.map((cat) => (
              <div key={cat.key} className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white/30 text-xs">{cat.icon}</span>
                  <span className="text-[11px] tracking-wide text-white/25 uppercase">
                    {cat.title}
                  </span>
                </div>
                <div className="space-y-0">
                  {cat.items.map((svc, i) => (
                    <div
                      key={svc.id}
                      className={`flex justify-between items-center py-3.5 ${
                        i < cat.items.length - 1 ? "border-b border-white/[0.03]" : ""
                      }`}
                    >
                      <span className="text-[13px] text-white/60">{svc.name}</span>
                      <span className="price text-white/70">{svc.price.toLocaleString()}₽</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
