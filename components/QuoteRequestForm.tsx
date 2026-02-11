"use client";

import { useState } from "react";

export default function QuoteRequestForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSent(false);

    try {
      const formEl = e.currentTarget;
      const formData = new FormData(formEl);

      const res = await fetch("/api/lead", {
        method: "POST",
        body: formData, // multipart/form-data
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "שגיאה בשליחת הבקשה");

      setSent(true);
      formEl.reset();
    } catch (err: any) {
      setError(err?.message || "שגיאה לא ידועה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl border border-zinc-100 bg-zinc-50 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            בקשה להצעת מחיר
          </h2>
          <p className="mt-2 text-zinc-600">
            שלחו פרטים + תמונות (אופציונלי) ונחזור אליכם עם אפשרויות מהמלאי.
          </p>

          <form onSubmit={onSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
            <input
              name="fullName"
              placeholder="שם מלא"
              className="rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:ring-2 focus:ring-zinc-900"
              required
            />
            <input
              name="phone"
              placeholder="טלפון"
              className="rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:ring-2 focus:ring-zinc-900"
              required
            />
            <input
              name="city"
              placeholder="עיר"
              className="rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:ring-2 focus:ring-zinc-900"
              required
            />
            <input
              name="doorsCount"
              placeholder="כמות דלתות (אופציונלי)"
              className="rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:ring-2 focus:ring-zinc-900"
            />

            <select
              name="preference"
              className="rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:ring-2 focus:ring-zinc-900 md:col-span-2"
              defaultValue=""
            >
              <option value="">העדפה (אופציונלי)</option>
              <option value="לבן">לבן</option>
              <option value="ציפוי עץ">ציפוי עץ</option>
              <option value="הזזה">הזזה</option>
              <option value="זכוכית">זכוכית</option>
              <option value="לא משנה">לא משנה</option>
            </select>

            <textarea
              name="message"
              placeholder="הודעה קצרה (מידות/סגנון/שאלות)"
              className="min-h-[120px] rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:ring-2 focus:ring-zinc-900 md:col-span-2"
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                תמונות (אופציונלי)
              </label>
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="block w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm"
              />
              <p className="mt-2 text-xs text-zinc-500">
                מומלץ עד 3 תמונות. (מומלץ תמונות של המשקוף/הדלת הקיימת/האזור)
              </p>
            </div>

            <button
              disabled={loading}
              className="rounded-2xl bg-zinc-900 px-6 py-4 font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 md:col-span-2"
            >
              {loading ? "שולח..." : "שלחו בקשה"}
            </button>

            {sent && (
              <p className="text-sm font-semibold text-emerald-700 md:col-span-2">
                נשלח בהצלחה ✅ נחזור אליכם בקרוב
              </p>
            )}
            {error && (
              <p className="text-sm font-semibold text-red-600 md:col-span-2">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
