"use client";

import * as React from "react";

type Option<T extends string | number> = {
  value: T;
  label: React.ReactNode;
  hint?: string;
};

type Props<T extends string | number> = {
  label: string;
  value: T | undefined;
  options: Option<T>[];
  onChange: (v: T) => void;
  columns?: 2 | 3 | 4;
  disabled?: boolean;
};

export function OptionGroup<T extends string | number>({
  label,
  value,
  options,
  onChange,
  columns = 2,
  disabled,
}: Props<T>) {
  const gridCols =
    columns === 4 ? "grid-cols-4" : columns === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-900">{label}</div>

      <div className={`grid ${gridCols} gap-2`}>
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={[
                "rounded-xl border px-3 py-3 text-right transition",
                "hover:border-gray-400 active:scale-[0.99]",
                disabled ? "opacity-50 cursor-not-allowed" : "",
                selected
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-900",
              ].join(" ")}
            >
              <div className="font-semibold leading-5">{opt.label}</div>
              {opt.hint ? (
                <div className={selected ? "text-white/80 text-xs mt-1" : "text-gray-500 text-xs mt-1"}>
                  {opt.hint}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
