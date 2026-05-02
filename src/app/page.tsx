"use client";

import { useEffect, useState } from "react";
import { initTG, getTGUser, isTGAdmin } from "@/lib/tg";
import { fetchServices } from "@/lib/api";
import Link from "next/link";
import type { Service } from "@/lib/api";

const CATS: Record<string, string> = {
  extension: "Наращивание",
  claws: "Когти",
  coverage: "Покрытие",
};

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      await initTG();
      setIsAdmin(await isTGAdmin());
      fetchServices().then(setServices);
    })();
  }, []);

  const grouped = Object.entries(CATS).map(([key, title]) => ({
    title,
    key,
    items: services.filter((s) => s.category === key),
  }));

  return (
    <div className="pb-24">
      {/* HERO */}
      <div className="px-5 pt-16 pb-10">
        <h1 className="text-[28px] font-light tracking-[0.15em] fade-up">
          ALIMSA
        </h1>
        <p className="text-white/25 text-[11px] tracking-[0.3em] uppercase mt-1 fade-up">
          nail studio
        </p>
      </div>

      <div className="px-5">
        {/* CTA */}
        <Link href="/booking" className="block fade-up">
          <button className="btn-book">Записаться</button>
        </Link>

        {isAdmin && (
          <Link href="/admin" className="block mt-3 fade-up">
            <button className="btn-ghost text-white/50">Панель мастера</button>
          </Link>
        )}

        {/* PRICE LIST */}
        <div className="mt-12">
          {grouped.map((cat) => (
            <div key={cat.key} className="mb-8">
              <p className="text-[11px] tracking-[0.15em] uppercase text-white/25 mb-3">
                {cat.title}
              </p>
              <div className="space-y-1">
                {cat.items.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex justify-between items-center py-3 border-b border-white/[0.04]"
                  >
                    <span className="text-[13px] text-white/70">{svc.name}</span>
                    <span className="text-[13px] font-medium">{svc.price.toLocaleString()}₽</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
