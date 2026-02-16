"use client";
import React, { useEffect, useRef, useState } from "react";

type FadeProps = {
  children: React.ReactNode;
  direction?: "left" | "right";
  delayMs?: number;
  distancePx?: number;
  durationMs?: number;
  threshold?: number;
};

export default function Fade({
  children,
  direction = "left",
  delayMs = 0,
  distancePx = 60,
  durationMs = 800,
  threshold = 0.2,
}: FadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect(); // מופעל פעם אחת
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const hiddenX = direction === "left" ? -distancePx : distancePx;

  return (
    <div
      ref={ref}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateX(0)" : `translateX(${hiddenX}px)`,
        transitionProperty: "opacity, transform",
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: "ease",
        transitionDelay: `${delayMs}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
