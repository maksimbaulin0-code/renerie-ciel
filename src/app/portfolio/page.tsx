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
      setItems(data.length > 0 ? data : FALLBACK.map((f) => ({ ...f, photo_url: "" })) as PortfolioItem[]);
    });
  }, []);

  return (
    <div className="px-5 pt-10 pb-24">
      <h1 className="text-[20px] font-light tracking-wide mb-8">Работы</h1>

      {/* CAROUSEL */}
      <div className="carousel -mx-5 px-5 mb-10">
        {items.map((item) => (
          <div key={item.id} className="w-[220px] h-[280px] card overflow-hidden flex flex-col">
            {item.photo_url ? (
              <img src={item.photo_url} alt={item.description} className="w-full h-[220px] object-cover" />
            ) : (
              <div className="w-full h-[220px] flex items-center justify-center bg-[var(--color-surface-2)]">
                <span className="text-white/10 text-3xl">◇</span>
              </div>
            )}
            <div className="p-3 flex-1 flex items-center">
              <p className="text-[11px] text-white/40">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-2">
        {items.slice(0, 6).map((item) => (
          <div key={item.id} className="card aspect-square overflow-hidden">
            {item.photo_url ? (
              <img src={item.photo_url} alt={item.description} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--color-surface-2)]">
                <span className="text-white/10 text-xl mb-1">◇</span>
                <p className="text-[9px] text-white/20 text-center px-2">{item.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
