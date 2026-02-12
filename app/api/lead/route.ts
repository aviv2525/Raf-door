import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const LeadSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  city: z.string().min(2),
  doorsCount: z.string().optional(),
  preference: z.string().optional(),
  message: z.string().optional(),
});

const MAX_FILES = 3;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB לכל תמונה (מומלץ)

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const payload = {
      fullName: String(form.get("fullName") || ""),
      phone: String(form.get("phone") || ""),
      city: String(form.get("city") || ""),
      doorsCount: String(form.get("doorsCount") || ""),
      preference: String(form.get("preference") || ""),
      message: String(form.get("message") || ""),
    };

    const lead = LeadSchema.parse(payload);

    // Files
    const files = form.getAll("images").filter(Boolean) as File[];
    const picked = files.slice(0, MAX_FILES);

    const attachments: { filename: string; content: Buffer }[] = [];

    for (const file of picked) {
      // במקרים מסוימים הדפדפן שולח "File" ריק אם לא בחרו כלום
      if (!file || typeof file.arrayBuffer !== "function") continue;

      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "ניתן לצרף רק תמונות." },
          { status: 400 }
        );
      }

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
      return NextResponse.json(
        { error: "Missing LEADS_TO_EMAIL" },
        { status: 500 }
      );
    }

    const subject = `בקשה להצעת מחיר - דלתות פנים (${lead.city})`;

    const text = [
      "בקשה חדשה התקבלה:",
      `שם: ${lead.fullName}`,
      `טלפון: ${lead.phone}`,
      `עיר: ${lead.city}`,
      lead.doorsCount ? `כמות דלתות: ${lead.doorsCount}` : null,
      lead.preference ? `העדפה: ${lead.preference}` : null,
      lead.message ? `הודעה: ${lead.message}` : null,
      attachments.length ? `מצורפות תמונות: ${attachments.length}` : "ללא תמונות מצורפות",
    ]
      .filter(Boolean)
      .join("\n");

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
