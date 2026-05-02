"use client";

import { useEffect, useState } from "react";
import { fetchReviews } from "@/lib/api";
import { sendTGData, getTGUser } from "@/lib/tg";
import type { Review } from "@/lib/api";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews().then(setReviews);
  }, []);

  const handleSubmit = async () => {
    if (!rating || !text.trim()) return;
    const user = await getTGUser();
    await sendTGData({ action: "review", text: text.trim(), rating, user_name: user.name });
    setReviews((prev) => [{ id: Date.now(), user_name: user.name, text: text.trim(), rating }, ...prev]);
    setText("");
    setRating(0);
    setShowForm(false);
  };

  return (
    <div className="px-5 pt-10 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[20px] font-light tracking-wide">Отзывы</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-[12px] text-white/30 border border-white/[0.08] rounded-lg px-3 py-1.5"
        >
          {showForm ? "Отмена" : "Написать"}
        </button>
      </div>

      {showForm && (
        <div className="card p-5 mb-8 space-y-4">
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)} className="text-[22px]">
                {s <= rating ? "★" : "☆"}
              </button>
            ))}
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Ваш отзыв..." rows={3} className="field" />
          <button onClick={handleSubmit} disabled={!rating || !text.trim()} className="btn-book disabled:opacity-20">
            Отправить
          </button>
        </div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-white/20 text-sm">Пока нет отзывов</p>
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="py-4 border-b border-white/[0.04]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px]">{r.user_name}</span>
                <span className="text-[12px] text-white/25">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed">{r.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
