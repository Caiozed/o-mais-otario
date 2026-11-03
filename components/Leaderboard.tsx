"use client";

import { type CSSProperties } from "react";
import type { Friend } from "@/lib/types";
import { Avatar } from "./Avatar";
import { ScoreValue } from "./ScoreValue";

type Props = {
  friends: Friend[];
  onEdit: (friend: Friend) => void;
  onMotivo: (friend: Friend, delta?: 1 | -1) => void;
  embedded?: boolean;
};

export function Leaderboard({
  friends,
  onEdit,
  onMotivo,
  embedded = false,
}: Props) {
  const rest = friends.slice(3);

  return (
    <section
      className={
        embedded
          ? ""
          : "anim-fade-up rounded-3xl border border-white/10 bg-[#14121c]/80 p-4 sm:p-5"
      }
      style={
        embedded
          ? undefined
          : ({ animationDelay: "180ms" } as CSSProperties)
      }
    >
      {!embedded && (
        <>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[#f3e7c6]">
            Tabela Completa (Top 20)
          </h2>
          <p className="mt-1 text-sm text-white/45">
            Toda mancada precisa de um motivo.
          </p>
        </>
      )}

      <ul className={`${embedded ? "mt-0" : "mt-4"} divide-y divide-white/8`}>
        {rest.length === 0 && (
          <li className="py-6 text-center text-sm text-white/40">
            Só o pódio por enquanto.
          </li>
        )}
        {rest.map((friend, index) => {
          const rank = index + 4;
          return (
            <li
              key={friend.id}
              className="anim-row list-row flex flex-col gap-3 rounded-xl px-1 py-3 sm:flex-row sm:items-center sm:justify-between"
              style={{ "--i": index } as CSSProperties}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 text-sm font-semibold text-white/40">
                  {rank}º
                </span>
                <Avatar
                  name={friend.name}
                  avatarUrl={friend.avatar_url}
                  size="sm"
                />
                <div>
                  <p className="font-medium text-white">{friend.name}</p>
                  {friend.status && (
                    <p className="text-xs text-white/40">{friend.status}</p>
                  )}
                </div>
                <ScoreValue
                  score={friend.score}
                  className="ml-2 text-sm text-[#f0d78c]/80"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pl-10 sm:pl-0">
                <button
                  type="button"
                  onClick={() => onMotivo(friend, 1)}
                  className="btn-press rounded-lg border border-white/10 px-2.5 py-1 text-sm text-white/80 hover:bg-white/5"
                  aria-label={`Subir ${friend.name}`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onMotivo(friend, -1)}
                  className="btn-press rounded-lg border border-white/10 px-2.5 py-1 text-sm text-white/80 hover:bg-white/5"
                  aria-label={`Descer ${friend.name}`}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onMotivo(friend, 1)}
                  className="btn-press rounded-lg bg-white/8 px-2.5 py-1 text-sm text-white/85 hover:bg-white/12"
                >
                  + Motivo
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(friend)}
                  className="btn-press rounded-lg px-2.5 py-1 text-sm text-white/45 hover:text-white/80"
                >
                  Editar
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
