// app/page.tsx
import { Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import QuoteRequestForm from "@/components/QuoteRequestForm";
import LeadForm from "@/components/LeadForm";
import DoorGallery from "@/components/DoorGallery";
import Fade from "@/components/Fade";


const PHONE = "0505368360"; 
const WHATSAPP = `https://wa.me/972${PHONE.replace(/^0/, "")}?text=${encodeURIComponent(
  "היי, אשמח להצעת מחיר לדלתות פנים"
)}`;

export default function HomePage() {
  return (
<main className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 text-zinc-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="font-semibold tracking-tight">
            רפי דלתות פנים - מכירה | התקנה | שיפוץ
          </div>

          <div className="hidden gap-2 sm:flex">
            <a
              href="#quote-form"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 font-semibold text-white shadow-lg hover:bg-zinc-800"
            >
              לקבלת הצעת מחיר
            </a>
            <a
              href={`tel:${PHONE}`}
              className="inline-flex-row-reverse items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-zinc-100"
            >
              <Phone className="h-4 w-4" />
              
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
            >
              <MessageCircle className="h-4 w-4" />
              וואטסאפ
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2 md:py-16">
<div className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur sm:p-10">

        <div className="mt-4 flex flex-wrap gap-2">
          {["אחריות מלאה", "עבודה נקייה", "התאמה אישית", "זמינות גבוהה"].map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700"
            >
              {t}
            </span>
          ))}
        </div>

          <div className="max-w-2xl">

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              דלתות פנים
              <span className="mt-2 block bg-gradient-to-r from-zinc-800 to-zinc-500 bg-clip-text text-transparent">
                מכירה, התקנה ושיפוץ בהתאמה אישית
              </span>
            </h1>

            <div className="mt-6 h-1 w-16 rounded-full bg-zinc-900" />

            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              מחליפים ומשפצים דלתות פנים מכל הסוגים,
              עם גימור מדויק, עמידות לאורך זמן
              ושירות אישי עד הבית.
            </p>

          </div>


          <div className="mt-6 flex flex-col gap-3 sm:flex-row-revers">
            <a
              href="#quote-form"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-700 px-5 py-3 font-semibold text-white shadow-sm hover:bg-amber-600"
            >
              לקבלת הצעת מחיר
            </a>
                        <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3 font-semibold text-white shadow-sm hover:bg-zinc-800"
            >
              <Phone className="h-5 w-5" />
           </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 font-semibold shadow-sm hover:bg-zinc-100"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "התקנה מקצועית ומהירה",
              "שיפוץ דלתות קיימות",
              "מחירים הוגנים",
              "שירות אמין ונעים",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">{t}</span>
              </div>
            ))}
          </div>
        </div>
        
{/*
  <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-white" />
          <div className="relative p-6 sm:p-8">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-sm font-semibold text-zinc-900">
                מה כולל השירות?
              </p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>• פירוק והתקנה נקייה</li>
                <li>• תיקונים, כיוון צירים, החלפת מנעולים</li>
                <li>• גימור מושלם וקבלת אחריות</li>
              </ul>
            </div>
              
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                <p className="text-xs text-zinc-500">זמן ממוצע</p>
                <p className="text-lg font-bold">24–72 שעות</p>
                <p className="text-xs text-zinc-500">לתיאום והגעה</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                <p className="text-xs text-zinc-500">אחריות</p>
                <p className="text-lg font-bold">מלאה</p>
                <p className="text-xs text-zinc-500">על התקנה ועבודה</p>
              </div>
            </div>
          </div>
        </div>
*/}
      
      </section>

      {/* Sticky WhatsApp on Mobile */}
      <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-5 py-4 font-semibold text-white shadow-lg"
        >
          <MessageCircle className="h-5 w-5" />
          שלחו וואטסאפ להצעת מחיר
        </a>
      </div>

      {/* Doors Types Section */}
<DoorGallery />

{/* Value Proposition: Surplus / Grade B */}
<section className="bg-white py-16">
  <div className="mx-auto max-w-6xl px-4">
    <div className="rounded-3xl border border-zinc-100 bg-zinc-50 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-10">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        דלתות עודפים / סוג ב׳ — מחירים נוחים, התקנה מקצועית
      </h2>

      <p className="mt-4 leading-relaxed text-zinc-700">
        מדובר בדלתות במחירי הזדמנות: לעיתים עודפים/סוף סדרה, ולעיתים פגמים קוסמטיים
        קלים (כמו שריטה קטנה/גוון) — לא משהו שפוגע בשימוש. אתם מקבלים ייעוץ אמיתי,
        התאמה לפי מידה וסגנון, והתקנה נקייה עם אחריות על העבודה.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-semibold">חוסכים כסף</p>
          <p className="mt-2 text-sm text-zinc-700">
            מחירים נוחים משמעותית לעומת דלת חדשה מהמדף.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-semibold">שקיפות מלאה</p>
          <p className="mt-2 text-sm text-zinc-700">
            מסבירים מראש אם יש פגם קוסמטי ומה המשמעות בפועל.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-semibold">אחריות על העבודה</p>
          <p className="mt-2 text-sm text-zinc-700">
            התקנה מקצועית, כיוונים וגימור — עד שהכול עובד חלק.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>



{/* FAQ */}
<section className="bg-white pb-16">
  <div className="mx-auto max-w-6xl px-4">
    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">שאלות נפוצות</h2>

    <div className="mt-8 grid gap-4 md:grid-cols-2">
  {[
  {
    q: "מה זה אומר דלתות סוג ב׳?",
    a: "בדרך כלל עודפים/סוף סדרה, או פגמים קוסמטיים קלים שנגרמו עקב הובלה או טעות במפעל. אנו מסבירים מראש בדיוק מה מצב הדלת.",
  },
  {
    q: "איך בוחרים דלת אם אין תמונות?",
    a: "שולחים הודעה/שיחה קצרה עם מידות וסגנון. מציעים אפשרויות מהמלאי הקיים ומעדכנים בשקיפות מלאה.",
  },
  {
    q: "הפגמים משפיעים על השימוש?",
    a: "לא. מדובר בפגמים קוסמטיים קטנים. ההתקנה והפעולה של הדלת נבדקות ומכוונות",
  },
  {
    q: "יש אחריות?",
    a: "כן — אחריות על ההתקנה והעבודה. בנוסף מבצעים כיוונים וגימור עד לתוצאה תקינה וחלקה.",
  },
  {
    q: "האם הפגמים נראים לעין?",
    a: "מדובר בפגמים קוסמטיים מינוריים בלבד – לרוב שריטה קטנה או קילוף צבע שטופל באופן מקצועי. כל דלת נבדקת ומוכנה להתקנה ברמת גימור גבוהה, וברוב המקרים אין הבדל נראה לעין. כך ניתן ליהנות מדלת איכותית במחיר נוח במיוחד.",
  },
  {
    q: "האם יש דלתות חדשות?",
    a: "כן. בנוסף לדלתות עודפים/סוג ב׳, אנו מציעים גם דלתות חדשות לגמרי לפי זמינות ומלאי. נשמח להתאים לכם פתרון בהתאם לתקציב ולסגנון הבית.",
  },
].map((item, idx) => (
  <Fade
    key={item.q}
    direction={idx % 2 === 1 ? "right" : "left"}
    delayMs={idx * 100}
  >
    <div className="rounded-3xl border border-zinc-100 bg-zinc-50 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <p className="font-semibold">{item.q}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700">
        {item.a}
      </p>
    </div>
  </Fade>
))}
    </div>
  </div>
</section>



      {/* Service Area (SEO) */}
<section className="bg-zinc-100 py-16">
  <div className="mx-auto max-w-6xl px-4">
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        שירות דלתות פנים במרכז הארץ
      </h2>

      <p className="mt-4 text-zinc-700 leading-relaxed">
        אנו מספקים שירות מכירה, התקנה ושיפוץ דלתות פנים בסטנדרט גבוה,
        עם עבודה נקייה, דיוק ואחריות מלאה – ללקוחות פרטיים וקבלנים.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <h3 className="font-semibold">אזורי שירות נפוצים</h3>
          <p className="mt-2 text-sm text-zinc-700">
            ראשון לציון • חולון • בת ים • תל אביב • גבעתיים • רמת גן •
            פתח תקווה • הרצליה • רעננה • כפר סבא • רחובות • נס ציונה
          </p>
          <p className="mt-3 text-xs text-zinc-500">
            לא בטוחים אם אנחנו מגיעים אליכם? שלחו הודעה ונאשר זמינות.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <h3 className="font-semibold">מה תקבלו אצלנו</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-700">
            <li>• ייעוץ והתאמה לפי הבית והתקציב</li>
            <li>• התקנה מקצועית וגימור מדויק</li>
            <li>• שיפוץ/כיוון דלתות קיימות</li>
            <li>• זמינות גבוהה ושירות אישי</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<QuoteRequestForm />


          
      {/* footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-zinc-600">
          © {new Date().getFullYear()} Aviv.m דלתות פנים — כל הזכויות שמורות
        </div>
      </footer>
    </main>
  );
}
