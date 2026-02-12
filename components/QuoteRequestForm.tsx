"use client";

import { useEffect, useState } from "react";

type DoorCondition = "B" | "NEW";
type WithFrame = "YES" | "NO";
type OpeningSide = "RIGHT" | "LEFT";
type LockType = "MAGNETIC" | "REGULAR_101";
type Hinges = "BOOK" | "PIPE";
type DoorEdge = "STEP" | "STRAIGHT";
type Brand = "PANDOOR" | "HAMADIA" | "RAV_BARIACH" | "OREN" | "NO_PREFERENCE";

type FrameSize = 60 | 70 | 75 | 80 | 90;
type FrameThickness = 10 | 12 | 14 | 16;
type DoorSize = 60 | 70 | 80 | 90;

function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
  className = "",
}: {
  label: string;
  value: T;
  options: { value: T; label: string; sub?: string }[];
  onChange: (v: T) => void;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-sm font-semibold text-zinc-800">{label}</div>
        {hint ? <div className="text-xs text-zinc-500">{hint}</div> : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                "rounded-2xl border p-4 text-right transition",
                "focus:outline-none focus:ring-2 focus:ring-zinc-900",
                selected
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400",
              ].join(" ")}
            >
              <div className="font-semibold">{opt.label}</div>
              {opt.sub ? (
                <div className={selected ? "mt-1 text-xs text-white/80" : "mt-1 text-xs text-zinc-500"}>
                  {opt.sub}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChoiceRow<T extends number | string>({
  label,
  value,
  options,
  onChange,
  columns = 4,
  disabled,
}: {
  label: string;
  value: T | undefined;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  columns?: 3 | 4 | 5;
  disabled?: boolean;
}) {
  const cols =
    columns === 5 ? "grid-cols-5" : columns === 3 ? "grid-cols-3" : "grid-cols-4";

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-zinc-800">{label}</div>
      <div className={`grid ${cols} gap-2`}>
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={[
                "rounded-2xl border p-3 text-center font-semibold transition",
                "focus:outline-none focus:ring-2 focus:ring-zinc-900",
                disabled ? "opacity-50 cursor-not-allowed" : "",
                selected
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400",
              ].join(" ")}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function QuoteRequestForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- מצב המפרט (כפתורים) ---
  const [doorCondition, setDoorCondition] = useState<DoorCondition>("B");
  const [withFrame, setWithFrame] = useState<WithFrame>("NO");

  const [frameSize, setFrameSize] = useState<FrameSize | undefined>(undefined);
  const [frameThickness, setFrameThickness] = useState<FrameThickness | undefined>(undefined);

  const [openingSide, setOpeningSide] = useState<OpeningSide>("RIGHT");
  const [lockType, setLockType] = useState<LockType>("REGULAR_101");

  const [hinges, setHinges] = useState<Hinges>("BOOK");
  const [doorEdge, setDoorEdge] = useState<DoorEdge>("STEP");
  const [brand, setBrand] = useState<Brand>("NO_PREFERENCE");
  const [doorSize, setDoorSize] = useState<DoorSize>(80);

  // כלל: בלי משקוף => מנעול רגיל אוטומטית + איפוס שדות משקוף
  useEffect(() => {
    if (withFrame === "NO") {
      setFrameSize(undefined);
      setFrameThickness(undefined);
      setLockType("REGULAR_101");
    } else {
      setFrameSize((v) => v ?? 80);
      setFrameThickness((v) => v ?? 12);
      // lockType נשאר רגיל כברירת מחדל, המשתמש יכול לשנות למגנטי
    }
  }, [withFrame]);

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

      // איפוס סטייט של הכפתורים (כדי שיחזור לברירות מחדל יפות)
      setDoorCondition("B");
      setWithFrame("NO");
      setOpeningSide("RIGHT");
      setHinges("BOOK");
      setDoorEdge("STEP");
      setBrand("NO_PREFERENCE");
      setDoorSize(80);
      setLockType("REGULAR_101");
      setFrameSize(undefined);
      setFrameThickness(undefined);
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
          השאירו פרטים ונחזור אליכם עם האפשרות הזולה ביותר בהקדם האפשרי!  
        </p>

          <form onSubmit={onSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
            {/* --- פרטים בסיסיים --- */}
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
              inputMode="tel"
            />
            <input
              name="city"
              placeholder="עיר"
              className="rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:ring-2 focus:ring-zinc-900"
              required
              list="cities"
            />
            <datalist id="cities">
              <option value="ראשון לציון" />
              <option value="נס ציונה" />
              <option value="רחובות" />
              <option value="חולון" />
              <option value="בת ים" />
              <option value="תל אביב" />
              <option value="רמלה" />
              <option value="לוד" />
            </datalist>

            <input
              name="streetAndNumber"
              placeholder="רחוב ומספר"
              className="rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:ring-2 focus:ring-zinc-900"
              required
            />

            <input
              name="doorsCount"
              placeholder="כמות דלתות (אופציונלי)"
              className="rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:ring-2 focus:ring-zinc-900"
            />

            {/* --- בלוק: מפרט דלת בכפתורים --- */}
            <div className="md:col-span-2 rounded-3xl border border-zinc-100 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
              <div className="text-lg font-bold text-zinc-900">מפרט דלת (קליק-קליק)</div>

              <ChoiceGroup<DoorCondition>
                label="סוג"
                value={doorCondition}
                onChange={setDoorCondition}
                options={[
                  { value: "B", label: "סוג ב׳", sub: "העדפה בלבד (לא תמיד מובטח)" },
                  { value: "NEW", label: "חדש" },
                ]}
              />

              <ChoiceGroup<WithFrame>
                label="משקוף"
                value={withFrame}
                onChange={setWithFrame}
                options={[
                  { value: "YES", label: "כולל משקוף" },
                  { value: "NO", label: "בלי משקוף" },
                ]}
              />

              {withFrame === "YES" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <ChoiceRow<FrameSize>
                    label="מידת משקוף"
                    value={frameSize}
                    onChange={setFrameSize}
                    columns={5}
                    options={[
                      { value: 60, label: "60" },
                      { value: 70, label: "70" },
                      { value: 75, label: "75" },
                      { value: 80, label: "80" },
                      { value: 90, label: "90" },
                    ]}
                  />
                  <ChoiceRow<FrameThickness>
                    label="עובי משקוף"
                    value={frameThickness}
                    onChange={setFrameThickness}
                    columns={4}
                    options={[
                      { value: 10, label: "10" },
                      { value: 12, label: "12" },
                      { value: 14, label: "14" },
                      { value: 16, label: "16" },
                    ]}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
                  מנעול: <span className="font-semibold">רגיל (101 אלבא)</span> (נבחר אוטומטית ללא משקוף)
                </div>
              )}

              <ChoiceGroup<OpeningSide>
                label="ימין / שמאל"
                value={openingSide}
                onChange={setOpeningSide}
                options={[
                  { value: "RIGHT", label: "ימין" },
                  { value: "LEFT", label: "שמאל" },
                ]}
              />

              {withFrame === "YES" ? (
                <ChoiceGroup<LockType>
                  label="מנעול"
                  value={lockType}
                  onChange={setLockType}
                  options={[
                    { value: "MAGNETIC", label: "טריקה שקטה", sub: "מגנטי" },
                    { value: "REGULAR_101", label: "מנעול רגיל", sub: "101 אלבא" },
                  ]}
                />
              ) : null}

              <ChoiceGroup<Hinges>
                label="צירים"
                value={hinges}
                onChange={setHinges}
                options={[
                  { value: "BOOK", label: "צירי ספר" },
                  { value: "PIPE", label: "ציר פייפ" },
                ]}
              />

              <ChoiceGroup<DoorEdge>
                label="סוג דלת"
                value={doorEdge}
                onChange={setDoorEdge}
                hint={doorCondition === "B" ? "בסוג ב׳ זו העדפה בלבד" : undefined}
                options={[
                  { value: "STEP", label: "מדרגה" },
                  { value: "STRAIGHT", label: "קנט ישר" },
                ]}
              />

              <ChoiceGroup<Brand>
                label="חברה"
                value={brand}
                onChange={setBrand}
                options={[
                  { value: "PANDOOR", label: "פנדור" },
                  { value: "HAMADIA", label: "חמדייה" },
                  { value: "RAV_BARIACH", label: "רב בריח" },
                  { value: "OREN", label: "דלתות אורן" },
                  { value: "NO_PREFERENCE", label: "לא משנה" },
                ]}
              />

              <ChoiceRow<DoorSize>
                label="מידת דלת"
                value={doorSize}
                onChange={setDoorSize}
                columns={4}
                options={[
                  { value: 60, label: "60" },
                  { value: 70, label: "70" },
                  { value: 80, label: "80" },
                  { value: 90, label: "90" },
                ]}
              />

              {/* Hidden inputs כדי לשמור על FormData בלי לשנות API כרגע */}
              <input type="hidden" name="doorCondition" value={doorCondition} />
              <input type="hidden" name="withFrame" value={withFrame} />
              <input type="hidden" name="frameSize" value={withFrame === "YES" && frameSize ? String(frameSize) : ""} />
              <input type="hidden" name="frameThickness" value={withFrame === "YES" && frameThickness ? String(frameThickness) : ""} />
              <input type="hidden" name="openingSide" value={openingSide} />
              <input type="hidden" name="lockType" value={lockType} />
              <input type="hidden" name="hinges" value={hinges} />
              <input type="hidden" name="doorEdge" value={doorEdge} />
              <input type="hidden" name="brand" value={brand} />
              <input type="hidden" name="doorSize" value={String(doorSize)} />
            </div>

            {/* הערות */}
            <textarea
              name="message"
              placeholder="הודעה קצרה (מידות/סגנון/שאלות)"
              className="min-h-[120px] rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:ring-2 focus:ring-zinc-900 md:col-span-2"
            />

            {/* תמונות */}
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
