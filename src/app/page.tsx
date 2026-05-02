"use client";

import { useEffect, useState } from "react";
import { initTG, getTGUser, isTGAdmin } from "@/lib/tg";
import { fetchServices } from "@/lib/api";
import Link from "next/link";
import type { Service } from "@/lib/api";

const CATEGORIES: Record<string, { title: string; icon: string }> = {
  extension: { title: "Наращивание", icon: "📏" },
  claws: { title: "Когти", icon: "🦅" },
  coverage: { title: "Покрытие", icon: "💅" },
};

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [userName, setUserName] = useState("Гость");
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

  const grouped = Object.entries(CATEGORIES).map(([key, cat]) => ({
    ...cat,
    key,
    services: services.filter((s) => s.category === key),
  }));

  return (
    <div className="px-4 pt-4 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-light tracking-wide">
          <span className="text-[var(--accent)]">Renerie Ciel</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Эстетика. Дисциплина. Качество.
        </p>
        <p className="text-white/30 text-xs mt-2">Привет, {userName}</p>
      </header>

      <div className="space-y-4 mb-8">
        <Link
          href="/booking"
          className="glass-card glass-card-hover accent-glow block p-4 text-center"
        >
          <span className="text-lg">💅</span>
          <span className="ml-2 font-medium">Записаться на маникюр</span>
        </Link>

        {isAdmin && (
          <Link
            href="/admin"
            className="glass-card glass-card-hover block p-4 text-center border-[var(--accent)]/20"
          >
            <span className="text-lg">🛠</span>
            <span className="ml-2 font-medium text-[var(--accent)]">
              Панель мастера
            </span>
          </Link>
        )}
      </div>

      <section>
        <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">
          Прайс-лист
        </h2>
        {grouped.map((cat) => (
          <div key={cat.key} className="mb-6">
            <h3 className="text-base font-medium mb-3">
              {cat.icon} {cat.title}
            </h3>
            <div className="space-y-2">
              {cat.services.map((svc) => (
                <div
                  key={svc.id}
                  className="glass-card p-3 flex justify-between items-center"
                >
                  <span className="text-sm text-white/80">{svc.name}</span>
                  <span className="text-sm font-medium text-[var(--accent)]">
                    {svc.price.toLocaleString()}₽
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
