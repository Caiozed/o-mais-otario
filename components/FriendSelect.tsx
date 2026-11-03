"use client";

import { useEffect, useRef, useState } from "react";
import type { Friend } from "@/lib/types";

type Props = {
  friends: Friend[];
  value: number | "";
  onChange: (id: number) => void;
};

export function FriendSelect({ friends, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = friends.find((f) => f.id === value);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative mt-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-[#0c0b12] px-3 py-2.5 text-left text-sm text-white outline-none focus:border-[#d4af37]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected?.name ?? "Escolha um amigo"}</span>
        <span className="text-white/45" aria-hidden>
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-white/15 bg-[#12101a] py-1 shadow-2xl"
        >
          {friends.map((f) => {
            const active = f.id === value;
            return (
              <li key={f.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(f.id);
                    setOpen(false);
                  }}
                  className={`block w-full px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-[#e84a7f]/25 text-[#ffb3cb]"
                      : "text-white/90 hover:bg-white/8"
                  }`}
                >
                  {f.name}
                  {typeof f.score === "number" && (
                    <span className="ml-2 text-xs text-white/35">
                      {f.score} pts
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
