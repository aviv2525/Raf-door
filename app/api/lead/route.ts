import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

// helper: הופך "" ל-undefined
const emptyToUndefined = (v: unknown) => {
  const s = String(v ?? "").trim();
  return s.length ? s : undefined;
};




const LeadSchema = z.object({
    // פרטי לקוח
    fullName: z.string().min(2, "שם קצר מדי"),
    phone: z.string().min(7, "טלפון קצר מדי"),
    city: z.string().min(2, "עיר חסרה"),
    streetAndNumber: z.string().min(2, "רחוב ומספר חסר"),
    doorsCount: z.string().optional(),
    message: z.string().optional(),

    // מפרט דלת (מהכפתורים)
    doorCondition: z.enum(["B", "NEW", "GENERIC"]),
    withFrame: z.enum(["YES", "NO"]),

    frameSize: z
      .union([z.literal("60"), z.literal("70"), z.literal("75"), z.literal("80"), z.literal("90")])
      .optional(),
    frameThickness: z
      .union([z.literal("10"), z.literal("12"), z.literal("14"), z.literal("16")])
      .optional(),

    openingSide: z.enum(["RIGHT", "LEFT"]),
    lockType: z.enum(["MAGNETIC", "REGULAR_101"]),
    hinges: z.enum(["BOOK", "PIPE"]),
    doorEdge: z.enum(["STEP", "STRAIGHT"]),
    brand: z.enum(["PANDOOR", "HAMADIA", "RAV_BARIACH", "OREN", "NO_PREFERENCE"]),
    doorSize: z.union([z.literal("60"), z.literal("70"), z.literal("80"), z.literal("90")]),
  })
  .superRefine((data, ctx) => {
    // חוקי עסק:
    if (data.withFrame === "YES") {
      if (!data.frameSize) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "חסרה מידת משקוף", path: ["frameSize"] });
      }
      if (!data.frameThickness) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "חסר עובי משקוף", path: ["frameThickness"] });
      }
    }

    // טריקה שקטה רק עם משקוף
    if (data.withFrame === "NO" && data.lockType === "MAGNETIC") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "טריקה שקטה אפשרית רק בהזמנת משקוף",
        path: ["lockType"],
      });
    }
  });

function labelMaps() {
  return {
    doorCondition: { B: "סוג ב׳", NEW: "חדש", GENERIC: "פנייה כללית" } as const,
    withFrame: { YES: "כולל משקוף", NO: "בלי משקוף" } as const,
    openingSide: { RIGHT: "ימין", LEFT: "שמאל" } as const,
    lockType: { MAGNETIC: "טריקה שקטה (מגנטי)", REGULAR_101: "מנעול רגיל (101 אלבא)" } as const,
    hinges: { BOOK: "צירי ספר", PIPE: "ציר פייפ" } as const,
    doorEdge: { STEP: "מדרגה", STRAIGHT: "קנט ישר" } as const,
    brand: {
      PANDOOR: "פנדור",
      HAMADIA: "חמדייה",
      RAV_BARIACH: "רב בריח",
      OREN: "דלתות אורן",
      NO_PREFERENCE: "לא משנה",
    } as const,
  };
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // קריאה של שדות (כולל חדשים)
    const payload = {
      fullName: String(form.get("fullName") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      city: String(form.get("city") || "").trim(),
      streetAndNumber: String(form.get("streetAndNumber") || "").trim(),

      doorsCount: emptyToUndefined(form.get("doorsCount")),
      message: emptyToUndefined(form.get("message")),

      doorCondition: String(form.get("doorCondition") || "B"),
      withFrame: String(form.get("withFrame") || "NO"),

      frameSize: emptyToUndefined(form.get("frameSize")),
      frameThickness: emptyToUndefined(form.get("frameThickness")),

      openingSide: String(form.get("openingSide") || "RIGHT"),
      lockType: String(form.get("lockType") || "REGULAR_101"),
      hinges: String(form.get("hinges") || "BOOK"),
      doorEdge: String(form.get("doorEdge") || "STEP"),
      brand: String(form.get("brand") || "NO_PREFERENCE"),
      doorSize: String(form.get("doorSize") || "80"),
    };

    const lead = LeadSchema.parse(payload);

    // Normalize server-side rules (גם אם UI תקין, זה חשוב נגד זיוף)
    const normalized = {
      ...lead,
      // אם אין משקוף => ננעל רגיל וננקה שדות משקוף
      lockType: lead.withFrame === "NO" ? "REGULAR_101" : lead.lockType,
      frameSize: lead.withFrame === "YES" ? lead.frameSize : undefined,
      frameThickness: lead.withFrame === "YES" ? lead.frameThickness : undefined,
    } as const;

// Files
const files = form.getAll("images") as File[];

// נשאיר רק קבצים אמיתיים (לא ריקים)
const validFiles = files.filter(
  (file) =>
    file &&
    typeof file.arrayBuffer === "function" &&
    file.size > 0
);

const picked = validFiles.slice(0, MAX_FILES);

const attachments: { filename: string; content: Buffer }[] = [];

for (const file of picked) {
  // בדיקת סוג קובץ
  const isImage =
    file.type?.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp)$/i.test(file.name || "");

  if (!isImage) {
    return NextResponse.json(
      { error: "ניתן לצרף רק תמונות." },
      { status: 400 }
    );
  }

  // בדיקת גודל
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "תמונה גדולה מדי. מומלץ עד 4MB לתמונה." },
      { status: 400 }
    );
  }

  const ab = await file.arrayBuffer();

  attachments.push({
    filename: file.name || `image-${attachments.length + 1}.jpg`,
    content: Buffer.from(ab),
  });
}


    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.LEADS_TO_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || "Doors Leads <onboarding@resend.dev>";

    if (!toEmail) {
      return NextResponse.json({ error: "Missing LEADS_TO_EMAIL" }, { status: 500 });
    }

    const m = labelMaps();

    const subject = `ליד חדש – דלתות פנים (${normalized.city})`;

    const specLines = [
      `מצב: ${m.doorCondition[normalized.doorCondition]}`,
      `משקוף: ${m.withFrame[normalized.withFrame]}`,
      normalized.withFrame === "YES"
        ? `משקוף: מידה ${normalized.frameSize} | עובי ${normalized.frameThickness}`
        : null,
      `כיוון: ${m.openingSide[normalized.openingSide]}`,
      `מנעול: ${m.lockType[normalized.lockType]}`,
      `צירים: ${m.hinges[normalized.hinges]}`,
      `סוג דלת: ${m.doorEdge[normalized.doorEdge]}${
        normalized.doorCondition === "B" ? " (בסוג ב׳ זו העדפה בלבד)" : ""
      }`,
      `חברה: ${m.brand[normalized.brand]}`,
      `מידת דלת: ${normalized.doorSize}`,
    ].filter(Boolean);

    const detailsLines = [
      `שם: ${normalized.fullName}`,
      `טלפון: ${normalized.phone}`,
      `כתובת: ${normalized.city}, ${normalized.streetAndNumber}`,
      normalized.doorsCount ? `כמות דלתות: ${normalized.doorsCount}` : null,
      normalized.message ? `הודעה: ${normalized.message}` : null,
      attachments.length ? `מצורפות תמונות: ${attachments.length}` : "ללא תמונות מצורפות",
    ].filter(Boolean);

    const text = [
      "ליד חדש התקבל ✅",
      "",
      "פרטי לקוח:",
      ...detailsLines.map((l) => `- ${l}`),
      "",
      "מפרט דלת:",
      ...specLines.map((l) => `- ${l}`),
    ].join("\n");

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject,
      text,
      attachments: attachments.length
        ? attachments.map((a) => ({ filename: a.filename, content: a.content }))
        : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
