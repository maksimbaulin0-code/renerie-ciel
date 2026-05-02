"use client";

import { useEffect, useState } from "react";
import { fetchServices } from "@/lib/api";
import Link from "next/link";
import type { Service } from "@/lib/api";

const CATS: Record<string, string> = {
  extension: "Наращивание",
  claws: "Когти",
  coverage: "Покрытие",
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  const grouped = Object.entries(CATS).map(([key, title]) => ({
    title,
    key,
    items: services.filter((s) => s.category === key),
  }));

  return (
    <div className="px-5 pt-10 pb-24">
      <h1 className="text-[20px] font-light tracking-wide mb-8">Прайс</h1>

      {/* CTA */}
      <Link href="/booking" className="block mb-10">
        <button className="btn-book">Записаться</button>
      </Link>

      {grouped.map((cat) => (
        <div key={cat.key} className="mb-8">
          <p className="text-[11px] tracking-[0.15em] uppercase text-white/25 mb-3">
            {cat.title}
          </p>
          <div className="space-y-1">
            {cat.items.map((svc) => (
              <Link href={`/booking?service=${svc.id}`} key={svc.id}>
                <div className="flex justify-between items-center py-3.5 border-b border-white/[0.04]">
                  <span className="text-[14px]">{svc.name}</span>
                  <span className="text-[14px] text-white/50">{svc.price.toLocaleString()}₽</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
