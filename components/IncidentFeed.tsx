import type { CSSProperties } from "react";
import type { Incident } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

type Props = {
  incidents: Incident[];
  embedded?: boolean;
};

export function IncidentFeed({ incidents, embedded = false }: Props) {
  return (
    <aside
      className={
        embedded
          ? ""
          : "anim-fade-up rounded-3xl border border-white/10 bg-[#14121c]/80 p-4 sm:p-5"
      }
      style={
        embedded
          ? undefined
          : ({ animationDelay: "260ms" } as CSSProperties)
      }
    >
      {!embedded && (
        <>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[#f3e7c6]">
            Mural de Ocorrências
          </h2>
          <p className="mt-1 text-sm text-white/45">
            As últimas traquinagens do grupo.
          </p>
        </>
      )}

      <ul className={`${embedded ? "mt-0" : "mt-4"} space-y-3`}>
        {incidents.length === 0 && (
          <li className="rounded-2xl border border-dashed border-white/10 px-3 py-6 text-center text-sm text-white/40">
            Nenhuma ocorrência ainda. Alguém vai vacilar.
          </li>
        )}
        {incidents.map((incident, index) => {
          const arrow =
            incident.delta > 0 ? "↑" : incident.delta < 0 ? "↓" : "★";
          const tone =
            incident.delta > 0
              ? "text-[#ff9fbc]"
              : incident.delta < 0
                ? "text-sky-300"
                : "text-[#f0d78c]";

          return (
            <li
              key={incident.id}
              className="anim-feed rounded-2xl border border-white/8 bg-black/20 px-3 py-3 transition hover:border-white/15 hover:bg-black/30"
              style={{ "--i": Math.min(index, 8) } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-white">
                  <span className={tone}>
                    {incident.friend_name} {arrow}{" "}
                    {incident.delta !== 0
                      ? `${Math.abs(incident.delta)} pos`
                      : "campeão"}
                  </span>
                </p>
                <time className="shrink-0 text-xs text-white/35">
                  {formatRelativeTime(incident.created_at)}
                </time>
              </div>
              {incident.reason && (
                <p className="mt-1 text-sm text-white/55">
                  “{incident.reason}”
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
