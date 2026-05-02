"use client";

import { useEffect, useState } from "react";
import { fetchPortfolio } from "@/lib/api";
import type { PortfolioItem } from "@/lib/api";

const FALLBACK_IMAGES = [
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
      if (data.length > 0) {
        setItems(data);
      } else {
        setItems(
          FALLBACK_IMAGES.map((f) => ({ ...f, photo_url: "" })) as PortfolioItem[]
        );
      }
    });
  }, []);

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-xl font-light tracking-wide mb-6">
        <span className="text-[var(--accent)]">Портфолио</span>
      </h1>

      <div className="carousel-container mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="glass-card w-[260px] h-[320px] flex flex-col items-center justify-center overflow-hidden"
          >
            {item.photo_url ? (
              <img
                src={item.photo_url}
                alt={item.description}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-4xl mb-3">✨</span>
                <p className="text-xs text-white/40 text-center px-4">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">
        До / После
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {items.slice(0, 4).map((item) => (
          <div
            key={`ba-${item.id}`}
            className="glass-card aspect-square flex flex-col items-center justify-center overflow-hidden"
          >
            {item.photo_url ? (
              <img
                src={item.photo_url}
                alt={item.description}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl mb-1">💅</span>
                <p className="text-[10px] text-white/30 text-center px-2">
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
