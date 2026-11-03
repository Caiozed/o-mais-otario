"use client";

import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  side: "left" | "right";
  title: string;
  children: ReactNode;
};

export function SideDrawer({ open, onClose, side, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const fromLeft = side === "left";

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        className="anim-backdrop absolute inset-0 bg-black/65"
        aria-label="Fechar painel"
        onClick={onClose}
      />
      <aside
        className={`anim-drawer absolute inset-y-0 flex w-[min(100%,22rem)] flex-col border-white/10 bg-[#12101a] shadow-2xl ${
          fromLeft ? "left-0 border-r" : "right-0 border-l"
        }`}
        role="dialog"
        aria-modal
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-[#f3e7c6]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/70"
          >
            Fechar
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">{children}</div>
      </aside>
    </div>
  );
}
