"use client";
import { useState } from "react";
import FadeIn from "@/components/FadeIn";


export default function DoorTypesSection() {
  const [openImg, setOpenImg] = useState<string | null>(null);
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  const doors = [
    { title: "דלתות לבנות מודרניות", img: "/images/20240613131717.685.png" },
    { title: "דלתות בצבע עץ", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6" },
    { title: "דלתות שקטות לחדר השינה", img: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf" },
    { title: "דלתות יד 2 או סוג ב'", img: "/images/door1.jpg" },
  ];

  return (
    <>
    <FadeIn>
      <section className="bg-zinc-400 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            סוגי דלתות פנים
          </h2>
          <p className="mt-2 text-zinc-100">
            מגוון רחב של דלתות בעיצובים שונים – בהתאמה מלאה לבית שלכם.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {doors.map((door) => (
              <div
                key={door.title}>              
                <div className="aspect-square overflow-hidden">
                  <img
                    src={door.img}
                    alt={door.title}
                    className="h-full w-full cursor-zoom-in object-cover transition duration-500 group-hover:scale-105"
                    onClick={() => {
                      setOpenImg(door.img);
                      setOpenTitle(door.title);
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{door.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeIn>

      {openImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpenImg(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpenImg(null)}
              className="absolute -top-3 -right-3 rounded-full bg-white px-3 py-1 text-sm font-semibold shadow"
              aria-label="סגור"
            >
              ✕
            </button>

            <img
              src={openImg}
              alt={openTitle ?? "תמונה מוגדלת"}
              className="max-h-[85vh] max-w-[92vw] rounded-2xl bg-white shadow-2xl"
            />

            {openTitle ? (
              <div className="mt-3 text-center text-sm text-white/90">
                {openTitle}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
