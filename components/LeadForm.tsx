"use client";

import * as React from "react";
import { OptionGroup } from "@/components/OptionGroup";

type Brand = "PANDOOR" | "HAMADIA" | "RAV_BARIACH" | "OREN" | "NO_PREFERENCE";
type LockType = "MAGNETIC" | "REGULAR_101";

type LeadDoorForm = {
  doorCondition: "B" | "NEW";
  withFrame: boolean;

  frameSize?: 60 | 70 | 75 | 80 | 90;
  frameThickness?: 10 | 12 | 14 | 16;

  openingSide: "RIGHT" | "LEFT";
  lockType: LockType;

  hinges: "BOOK" | "PIPE";
  doorEdge: "STEP" | "STRAIGHT";

  brand: Brand;
  doorSize: 60 | 70 | 80 | 90;

  fullName: string;
  phone: string;

  city: string;
  streetAndNumber: string;

  notes?: string;
};

const initialForm: LeadDoorForm = {
  doorCondition: "B",
  withFrame: false,
  lockType: "REGULAR_101",

  openingSide: "RIGHT",
  hinges: "BOOK",
  doorEdge: "STEP",

  brand: "NO_PREFERENCE",
  doorSize: 80,

  fullName: "",
  phone: "",
  city: "",
  streetAndNumber: "",
  notes: "",
};

function normalizePhone(raw: string) {
  return raw.replace(/[^\d+]/g, "");
}

export default function LeadForm() {
  const [form, setForm] = React.useState<LeadDoorForm>(initialForm);
  const [submitting, setSubmitting] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  function update<K extends keyof LeadDoorForm>(key: K, value: LeadDoorForm[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value } as LeadDoorForm;

      // כלל: בלי משקוף => מנעול רגיל אוטומטי + איפוס שדות משקוף
      if (key === "withFrame") {
        if (value === false) {
          next.frameSize = undefined;
          next.frameThickness = undefined;
          next.lockType = "REGULAR_101";
        } else {
          next.frameSize = next.frameSize ?? 80;
          next.frameThickness = next.frameThickness ?? 12;
          // lockType נשאר, אפשר להשאיר רגיל כברירת מחדל
        }
      }

      return next;
    });
  }

  const valid =
    form.fullName.trim().length >= 2 &&
    normalizePhone(form.phone).length >= 8 &&
    form.city.trim().length >= 2 &&
    form.streetAndNumber.trim().length >= 2 &&
    (!form.withFrame || (form.frameSize && form.frameThickness));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!valid) {
      setMsg("חסרים פרטים חובה (שם, טלפון, עיר, רחוב ומספר, ואם יש משקוף גם מידות).");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        fullName: form.fullName.trim(),
        phone: normalizePhone(form.phone),
        city: form.city.trim(),
        streetAndNumber: form.streetAndNumber.trim(),
        notes: form.notes?.trim() || "",
      };

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setMsg("לא הצלחנו לשלוח כרגע. נסה שוב בעוד רגע.");
        return;
      }

      setMsg("נשלח! נחזור אליך בהקדם 🙏");
    } catch {
      setMsg("שגיאת רשת. בדוק חיבור ונסה שוב.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-2xl space-y-6">
      {/* מפרט דלת בכפתורים */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-6">
        <div>
          <div className="text-xl font-bold text-gray-900">מפרט דלת</div>
          <div className="mt-1 text-sm text-gray-600">בחר בכפתורים (בלי חפירות).</div>
        </div>

        <OptionGroup
          label="סוג"
          value={form.doorCondition}
          onChange={(v) => update("doorCondition", v)}
          columns={2}
          options={[
            { value: "B", label: "סוג ב׳", hint: "העדפה, לא תמיד מובטח" },
            { value: "NEW", label: "חדש" },
          ]}
        />

        <OptionGroup
          label="משקוף"
          value={form.withFrame ? "YES" : "NO"}
          onChange={(v) => update("withFrame", v === "YES")}
          columns={2}
          options={[
            { value: "YES", label: "כולל משקוף" },
            { value: "NO", label: "בלי משקוף" },
          ]}
        />

        {form.withFrame ? (
          <div className="space-y-6">
            <OptionGroup<60 | 70 | 75 | 80 | 90>
              label="מידת משקוף"
              value={form.frameSize}
              onChange={(v) => update("frameSize", v)}
              columns={5}
              options={[
                { value: 60, label: "60" },
                { value: 70, label: "70" },
                { value: 75, label: "75" },
                { value: 80, label: "80" },
                { value: 90, label: "90" },
              ]}
            />

            <OptionGroup<10 | 12 | 14 | 16>
              label="עובי משקוף"
              value={form.frameThickness}
              onChange={(v) => update("frameThickness", v)}
              columns={4}
              options={[
                { value: 10, label: "10" },
                { value: 12, label: "12" },
                { value: 14, label: "14" },
                { value: 16, label: "16" },
              ]}
            />

            <OptionGroup<LockType>
              label="מנעול (רק כשיש משקוף)"
              value={form.lockType}
              onChange={(v) => update("lockType", v)}
              columns={2}
              options={[
                { value: "MAGNETIC", label: "טריקה שקטה", hint: " מגנטי" },
                { value: "REGULAR_101", label: "מנעול סטנדרטי", hint: "דגם 101" },
              ]}
            />
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            מנעול: <span className="font-semibold">סטנדרטי (101)</span> (נבחר אוטומטית ללא משקוף)
          </div>
        )
        }

        <OptionGroup
          label="ימין / שמאל"
          value={form.openingSide}
          onChange={(v) => update("openingSide", v)}
          columns={2}
          options={[
            { value: "RIGHT", label: "ימין" },
            { value: "LEFT", label: "שמאל" },
          ]}
        />

        <OptionGroup
          label="צירים"
          value={form.hinges}
          onChange={(v) => update("hinges", v)}
          columns={2}
          options={[
            { value: "BOOK", label: "צירי ספר" },
            { value: "PIPE", label: "ציר פייפ" },
          ]}
        />

        <OptionGroup
          label="סוג דלת"
          value={form.doorEdge}
          onChange={(v) => update("doorEdge", v)}
          columns={2}
          options={[
            { value: "STEP", label: "מדרגה", hint: form.doorCondition === "B" ? "בסוג ב׳ זו העדפה" : undefined },
            { value: "STRAIGHT", label: "קנט ישר", hint: form.doorCondition === "B" ? "בסוג ב׳ זו העדפה" : undefined },
          ]}
        />

        <OptionGroup<Brand>
          label="חברה"
          value={form.brand}
          onChange={(v) => update("brand", v)}
          columns={2}
          options={[
            { value: "PANDOOR", label: "פנדור" },
            { value: "HAMADIA", label: "חמדייה" },
            { value: "RAV_BARIACH", label: "רב בריח" },
            { value: "OREN", label: "דלתות אורן" },
            { value: "NO_PREFERENCE", label: "לא משנה" },
          ]}
        />

        <OptionGroup<60 | 70 | 80 | 90>
          label="מידת דלת"
          value={form.doorSize}
          onChange={(v) => update("doorSize", v)}
          columns={4}
          options={[
            { value: 60, label: "60" },
            { value: 70, label: "70" },
            { value: 80, label: "80" },
            { value: 90, label: "90" },
          ]}
        />
      </div>

      {/* פרטי קשר + כתובת (2 שדות כתובת) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="text-xl font-bold text-gray-900">פרטי קשר</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-900"
            placeholder="שם מלא"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-900"
            placeholder="טלפון"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* עיר עם הצעות (דאטאליסט) — עדיין שדה אחד */}
          <div>
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-900"
              placeholder="עיר"
              list="cities"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
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
          </div>

          <input
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-900"
            placeholder="רחוב ומספר"
            value={form.streetAndNumber}
            onChange={(e) => update("streetAndNumber", e.target.value)}
          />
        </div>

        <textarea
          className="w-full min-h-[110px] rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-900"
          placeholder="הערות (אופציונלי) — מידות מיוחדות/סגנון/שאלות"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
        />

        <button
          type="submit"
          disabled={!valid || submitting}
          className={[
            "w-full rounded-xl px-4 py-3 font-semibold transition",
            !valid || submitting
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-black",
          ].join(" ")}
        >
          {submitting ? "שולח..." : "שלחו בקשה"}
        </button>

        {msg ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800">
            {msg}
          </div>
        ) : null}
      </div>
    </form>
  );
}
