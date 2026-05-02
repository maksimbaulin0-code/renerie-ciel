"use client";

import { useEffect, useState } from "react";
import { initTG, getTGUser, isTGAdmin } from "@/lib/tg";
import { fetchServices } from "@/lib/api";
import Link from "next/link";
import type { Service } from "@/lib/api";

const CATS: Record<string, { title: string; icon: string; desc: string }> = {
  extension: { title: "Наращивание", icon: "✦", desc: "от 4 000₽" },
  claws: { title: "Когти", icon: "◇", desc: "от 1 000₽" },
  coverage: { title: "Покрытие", icon: "◧", desc: "от 500₽" },
};

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      await initTG();
      const user = await getTGUser();
      setUserName(user.name);
      setIsAdmin(await isTGAdmin());
      fetchServices().then(setServices);
    })();
  }, []);

  const grouped = Object.entries(CATS).map(([key, cat]) => ({
    ...cat,
    key,
    services: services.filter((s) => s.category === key),
  }));

  return (
    <div className="pb-24">
      {/* HERO */}
      <div className="hero-bg relative px-5 pt-14 pb-16">
        <div className="relative z-10">
          <p className="text-[var(--color-text-muted)] text-xs font-medium tracking-[0.2em] uppercase mb-3 animate-in">
            Студия маникюра
          </p>
          <h1 className="text-3xl font-light tracking-wide animate-in animate-in-delay-1">
            <span className="text-[var(--color-accent)]">Alimsa</span>{" "}
            <span className="text-[var(--color-gold)]">nail</span>
          </h1>
          <p className="text-[var(--color-text-dim)] text-sm mt-3 leading-relaxed animate-in animate-in-delay-2">
            Эстетика в каждой детали
          </p>

          {userName && (
            <p className="text-[var(--color-text-muted)] text-xs mt-4 animate-in animate-in-delay-3">
              {isAdmin ? "✦ Добро пожаловать, мастер" : `Привет, ${userName}`}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 -mt-2">
        {/* MAIN CTA */}
        <Link href="/booking" className="block animate-in animate-in-delay-2">
          <div className="card card-active p-5 text-center">
            <span className="text-lg">✦</span>
            <span className="ml-2 font-semibold text-[15px]">
              Записаться на маникюр
            </span>
          </div>
        </Link>

        {isAdmin && (
          <Link href="/admin" className="block mt-3 animate-in animate-in-delay-3">
            <div className="card p-4 text-center border-[var(--color-gold)]/20">
              <span className="text-sm text-[var(--color-gold)]">✦ Панель мастера</span>
            </div>
          </Link>
        )}

        {/* CATEGORIES QUICK ACCESS */}
        <div className="flex gap-3 mt-8 animate-in animate-in-delay-3">
          {grouped.map((cat) => (
            <Link
              key={cat.key}
              href="/services"
              className="card flex-1 p-4 text-center"
            >
              <span className="text-xl block mb-1">{cat.icon}</span>
              <span className="text-xs font-medium block">{cat.title}</span>
              <span className="text-[10px] text-[var(--color-text-muted)] block mt-0.5">
                {cat.desc}
              </span>
            </Link>
          ))}
        </div>

        {/* PRICE LIST */}
        <div className="mt-10">
          <p className="section-label mb-5">Прайс-лист</p>
          {grouped.map((cat) => (
            <div key={cat.key} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">{cat.icon}</span>
                <span className="text-sm font-medium">{cat.title}</span>
              </div>
              <div className="space-y-2">
                {cat.services.map((svc) => (
                  <div key={svc.id} className="card p-4 flex justify-between items-center">
                    <span className="text-[13px] text-[var(--color-text-dim)]">
                      {svc.name}
                    </span>
                    <span className="price-tag">
                      {svc.price.toLocaleString()}₽
                    </span>
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
