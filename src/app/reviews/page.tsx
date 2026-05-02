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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews()
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (rating === 0 || !text.trim()) return;
    const user = await getTGUser();
    try {
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
    } catch {
      alert("Не удалось отправить отзыв");
    }
  };

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="px-5 pt-10 pb-24">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[20px] font-light tracking-wide mb-1">Отзывы</h1>
          {avg && (
            <div className="flex items-center gap-2">
              <span className="text-[22px] font-light">{avg}</span>
              <span className="text-white/20 text-xs">
                {reviews.length} {reviews.length === 1 ? "отзыв" : "отзывов"}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-sm !py-2 !px-3"
        >
          {showForm ? "Отмена" : "Написать"}
        </button>
      </div>

      {showForm && (
        <div className="card p-5 mb-8 space-y-4">
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
                className="text-[24px] transition-transform active:scale-110"
              >
                {s <= (hoverStar || rating) ? "★" : "☆"}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ваш отзыв..."
            rows={3}
            className="field"
          />
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || !text.trim()}
            className="btn-book disabled:opacity-15"
          >
            Отправить
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white/[0.02] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-0">
          {reviews.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                <span className="text-white/15">♡</span>
              </div>
              <p className="text-white/20 text-sm">Пока нет отзывов</p>
              <p className="text-white/10 text-xs mt-1">Будьте первым</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="py-5 border-b border-white/[0.03]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px]">{review.user_name}</span>
                  <span className="text-white/15 text-xs tracking-wider">
                    {"★".repeat(review.rating)}
                  </span>
                </div>
                <p className="text-[13px] text-white/45 leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
