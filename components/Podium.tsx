"use client";

import { type CSSProperties } from "react";
import type { Friend } from "@/lib/types";
import { Avatar } from "./Avatar";
import { ScoreValue } from "./ScoreValue";

type Props = {
  friends: Friend[];
  onEdit: (friend: Friend) => void;
  onMotivo: (friend: Friend, delta?: 1 | -1) => void;
};

const podiumMeta = [
  {
    place: 2,
    label: "Vice-Canalha",
    accent: "from-[#9aa4b2]/30 to-transparent border-[#c0c7d1]/40",
    glow: "",
    order: "order-2 sm:order-1",
    delay: 1,
  },
  {
    place: 1,
    label: "Líder Absoluto da Tramboia",
    accent: "from-[#d4af37]/35 to-transparent border-[#d4af37]/70",
    glow: "anim-champion sm:-translate-y-3",
    order: "order-1 sm:order-2",
    delay: 0,
  },
  {
    place: 3,
    label: "Bronze da Pilantragem",
    accent: "from-[#cd7f32]/30 to-transparent border-[#cd7f32]/45",
    glow: "",
    order: "order-3",
    delay: 2,
  },
] as const;

export function Podium({ friends, onEdit, onMotivo }: Props) {
  const top3 = [friends[1], friends[0], friends[2]];

  return (
    <section className="mt-8">
      <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
        {podiumMeta.map((meta, idx) => {
          const friend = top3[idx];
          if (!friend) {
            return (
              <div
                key={meta.place}
                className={`anim-stagger ${meta.order} rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-center text-white/35`}
                style={{ "--i": meta.delay } as CSSProperties}
              >
                #{meta.place} vago
              </div>
            );
          }

          return (
            <article
              key={friend.id}
              className={`anim-stagger podium-card ${meta.order} ${meta.glow} rounded-3xl border bg-gradient-to-b ${meta.accent} p-5 backdrop-blur`}
              style={{ "--i": meta.delay } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                  #{meta.place}
                </p>
                <button
                  type="button"
                  onClick={() => onEdit(friend)}
                  className="text-xs text-white/45 transition hover:text-white/80"
                >
                  Editar
                </button>
              </div>

              <div className="mt-3 flex flex-col items-center text-center">
                {meta.place === 1 && (
                  <span className="anim-crown mb-2 text-2xl" aria-hidden>
                    👑
                  </span>
                )}
                <Avatar
                  name={friend.name}
                  avatarUrl={friend.avatar_url}
                  size="lg"
                />
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[#f8f1dd]">
                  {friend.name}
                </h3>
                <p className="text-sm text-white/50">{meta.label}</p>
                <ScoreValue
                  score={friend.score}
                  className="mt-2 text-lg font-semibold text-[#f0d78c]"
                />
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onMotivo(friend, 1)}
                  className="btn-press rounded-full bg-[#e84a7f]/90 px-3 py-1.5 text-sm font-bold text-white"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => onMotivo(friend, -1)}
                  className="btn-press rounded-full border border-white/15 px-3 py-1.5 text-sm font-bold text-white/80"
                >
                  −1
                </button>
              </div>

              {meta.place === 1 && (
                <button
                  type="button"
                  onClick={() => onMotivo(friend, 1)}
                  className="btn-press mt-3 w-full rounded-full bg-[#d4af37] px-3 py-2 text-sm font-semibold text-[#2a2108]"
                >
                  Registrar Nova Mancada
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
