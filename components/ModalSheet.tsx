"use client";

import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

/** Bottom drawer on mobile, centered modal on desktop. */
export function ModalSheet({ open, onClose, title, subtitle, children }: Props) {
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

  return (
    <div className="anim-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Fechar"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal
        aria-label={title}
        className="anim-sheet relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-3xl border border-white/10 bg-[#16141f] shadow-2xl sm:max-h-[85vh] sm:max-w-md sm:rounded-2xl"
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 sm:hidden" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-white/25" />
        </div>

        <div className="flex items-start justify-between gap-3 border-b border-white/8 px-5 pb-3 pt-2 sm:border-0 sm:pb-0 sm:pt-5">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[#f3e7c6]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-white/50">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-sm text-white/70 sm:hidden"
          >
            Fechar
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 sm:pb-5">
          {children}
        </div>
      </div>
    </div>
  );
}
