"use client";

import { useEffect, useState } from "react";
import { fetchPortfolio } from "@/lib/api";
import type { PortfolioItem } from "@/lib/api";

const FALLBACK = [
  { id: 1, description: "Наращивание — нюдовый френч" },
  { id: 2, description: "Короткие — молочный цвет" },
  { id: 3, description: "Длинные — зеркальный эффект" },
  { id: 4, description: "Когти — чёрный мат" },
  { id: 5, description: "Покрытие — лунный маникюр" },
  { id: 6, description: "Френч — классический" },
];

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    fetchPortfolio().then((data) => {
      setItems(
        data.length > 0
          ? data
          : (FALLBACK.map((f) => ({ ...f, photo_url: "" })) as PortfolioItem[])
      );
    });
  }, []);

  return (
    <div className="px-5 pt-6 pb-24">
      <h1 className="text-xl font-light tracking-wide mb-1">
        <span className="text-[var(--color-accent)]">Портфолио</span>
      </h1>
      <p className="text-[var(--color-text-muted)] text-xs mb-6">
        Работы мастера
      </p>

      {/* CAROUSEL */}
      <div className="carousel mb-8 -mx-5 px-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="card w-[240px] h-[300px] overflow-hidden flex flex-col"
          >
            {item.photo_url ? (
              <img
                src={item.photo_url}
                alt={item.description}
                className="w-full h-[220px] object-cover"
              />
            ) : (
              <div className="w-full h-[220px] flex items-center justify-center bg-[var(--color-surface-2)]">
                <span className="text-4xl opacity-20">✦</span>
              </div>
            )}
            <div className="p-3 flex-1 flex items-center">
              <p className="text-xs text-[var(--color-text-dim)]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* GRID */}
      <p className="section-label mb-4">Галерея</p>
      <div className="grid grid-cols-2 gap-3">
        {items.slice(0, 6).map((item) => (
          <div
            key={`g-${item.id}`}
            className="card aspect-square overflow-hidden"
          >
            {item.photo_url ? (
              <img
                src={item.photo_url}
                alt={item.description}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--color-surface-2)]">
                <span className="text-2xl opacity-20 mb-1">◇</span>
                <p className="text-[9px] text-[var(--color-text-muted)] text-center px-2">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
