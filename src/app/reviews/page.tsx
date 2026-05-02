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
  const [hoverStar, setHoverStar] = useState(0);

  useEffect(() => {
    fetchReviews().then(setReviews);
  }, []);

  const handleSubmit = async () => {
    if (rating === 0 || !text.trim()) return;
    const user = await getTGUser();
    await sendTGData({ action: "review", text: text.trim(), rating, user_name: user.name });
    setReviews((prev) => [
      { id: Date.now(), user_name: user.name, text: text.trim(), rating },
      ...prev,
    ]);
    setText("");
    setRating(0);
    setShowForm(false);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div className="px-5 pt-6 pb-24">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-light tracking-wide">
            <span className="text-[var(--color-accent)]">Отзывы</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-light text-[var(--color-gold)]">{avgRating}</span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {reviews.length} {reviews.length === 1 ? "отзыв" : "отзывов"}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-secondary !w-auto !px-4 !py-2 text-xs font-medium"
        >
          {showForm ? "Отмена" : "✎ Написать"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card p-5 mb-6 space-y-4">
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverStar(star)}
                onMouseLeave={() => setHoverStar(0)}
                className="star-btn"
              >
                {star <= (hoverStar || rating) ? "★" : "☆"}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Расскажите о вашем опыте..."
            rows={3}
            className="field"
          />
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || !text.trim()}
            className="btn btn-primary disabled:opacity-30"
          >
            Отправить отзыв
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="card p-8 text-center">
            <span className="text-3xl opacity-20 block mb-2">♡</span>
            <p className="text-[var(--color-text-muted)] text-sm">
              Пока нет отзывов
            </p>
            <p className="text-[var(--color-text-muted)] text-xs mt-1">
              Будьте первым!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="card p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{review.user_name}</span>
                <span className="text-[var(--color-gold)] text-xs tracking-wider">
                  {"★".repeat(review.rating)}
                  <span className="text-[var(--color-text-muted)]">
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </span>
              </div>
              <p className="text-[13px] text-[var(--color-text-dim)] leading-relaxed">
                {review.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
