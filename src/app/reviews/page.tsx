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
    if (rating === 0 || !text.trim()) return;
    const user = await getTGUser();
    await sendTGData({
      action: "review",
      text: text.trim(),
      rating,
      user_name: user.name,
    });
    setReviews((prev) => [
      { id: Date.now(), user_name: user.name, text: text.trim(), rating },
      ...prev,
    ]);
    setText("");
    setRating(0);
    setShowForm(false);
  };

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-light tracking-wide">
          <span className="text-[var(--accent)]">Отзывы</span>
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="glass-card px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
        >
          {showForm ? "Отмена" : "+ Написать"}
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-4 mb-6 space-y-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="star"
              >
                {star <= rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Расскажите о вашем опыте..."
            rows={3}
            className="resize-none"
          />
          <button onClick={handleSubmit} className="btn-primary text-sm">
            Отправить отзыв
          </button>
        </div>
      )}

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <p className="text-white/30 text-sm">
              Пока нет отзывов. Будьте первым!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="glass-card p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{review.user_name}</span>
                <span className="text-xs">
                  {"⭐".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                {review.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
