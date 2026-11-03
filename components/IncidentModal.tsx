"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { adjustScore } from "@/lib/actions";
import type { Friend } from "@/lib/types";
import { FriendSelect } from "./FriendSelect";
import { ModalSheet } from "./ModalSheet";

type Props = {
  open: boolean;
  onClose: () => void;
  friends: Friend[];
  preselectedId?: number | null;
  preselectedDelta?: 1 | -1;
  onPlusOne?: (origin?: { x: number; y: number }) => void;
};

export function IncidentModal({
  open,
  onClose,
  friends,
  preselectedId,
  preselectedDelta = 1,
  onPlusOne,
}: Props) {
  const [friendId, setFriendId] = useState<number | "">("");
  const [delta, setDelta] = useState<1 | -1>(1);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setFriendId(preselectedId ?? friends[0]?.id ?? "");
    setDelta(preselectedDelta);
    setReason("");
    setError(null);
  }, [open, preselectedId, preselectedDelta, friends]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (friendId === "") {
      setError("Escolha um amigo");
      return;
    }
    if (!reason.trim()) {
      setError("Motivo é obrigatório");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await adjustScore(friendId, delta, reason);
        if (delta === 1) onPlusOne?.();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao registrar");
      }
    });
  }

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title="Registrar canalhice"
      subtitle="Sem motivo, não rola. Conta a mancada."
    >
      <form onSubmit={submit}>
        <div>
          <p className="text-xs uppercase tracking-wide text-white/45">Amigo</p>
          <FriendSelect
            friends={friends}
            value={friendId}
            onChange={setFriendId}
          />
        </div>

        <div className="mt-3">
          <p className="text-xs uppercase tracking-wide text-white/45">
            Pontos
          </p>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => setDelta(1)}
              className={`btn-press flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold ${
                delta === 1
                  ? "border-[#e84a7f] bg-[#e84a7f]/20 text-[#ff9fbc]"
                  : "border-white/10 text-white/60"
              }`}
            >
              +1 canalhice
            </button>
            <button
              type="button"
              onClick={() => setDelta(-1)}
              className={`btn-press flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold ${
                delta === -1
                  ? "border-sky-400 bg-sky-400/15 text-sky-200"
                  : "border-white/10 text-white/60"
              }`}
            >
              −1 absolvição
            </button>
          </div>
        </div>

        <label className="mt-3 block text-xs uppercase tracking-wide text-white/45">
          Motivo *
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#d4af37]"
            placeholder="Ex: Pediu Uber pro grupo e mandou cobrar no pix"
          />
        </label>

        {error && (
          <p className="mt-3 text-sm text-[#ff7a9a]" role="alert">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2 pb-2">
          <button
            type="submit"
            disabled={pending || friends.length === 0 || !reason.trim()}
            className="btn-press rounded-full bg-[#e84a7f] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Registrando..." : "Registrar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-press hidden rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/80 sm:inline-flex"
          >
            Cancelar
          </button>
        </div>
      </form>
    </ModalSheet>
  );
}
