"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import {
  createFriend,
  deleteFriend,
  updateFriend,
} from "@/lib/actions";
import type { Friend } from "@/lib/types";
import { ModalSheet } from "./ModalSheet";

type Props = {
  open: boolean;
  onClose: () => void;
  friend?: Friend | null;
};

export function FriendFormModal({ open, onClose, friend }: Props) {
  const isEdit = Boolean(friend);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [score, setScore] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setName(friend?.name ?? "");
    setStatus(friend?.status ?? "");
    setAvatarUrl(friend?.avatar_url ?? "");
    setPhone(friend?.phone ?? "");
    setScore(String(friend?.score ?? 0));
    setError(null);
  }, [open, friend]);

  function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        if (isEdit && friend) {
          await updateFriend(friend.id, {
            name,
            status,
            avatarUrl,
            phone,
            score: Number(score),
          });
        } else {
          await createFriend({ name, status, avatarUrl, phone });
        }
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar");
      }
    });
  }

  function onDelete() {
    if (!friend) return;
    if (!confirm(`Excluir ${friend.name} do ranking?`)) return;
    startTransition(async () => {
      try {
        await deleteFriend(friend.id);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao excluir");
      }
    });
  }

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar amigo" : "Adicionar amigo"}
      subtitle="Nome, WhatsApp e avatar. Tudo editável depois."
    >
      <form onSubmit={submit}>
        <label className="block text-xs uppercase tracking-wide text-white/45">
          Nome
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#d4af37]"
            placeholder="Ex: Thiago"
          />
        </label>

        <label className="mt-3 block text-xs uppercase tracking-wide text-white/45">
          WhatsApp (com DDD)
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#d4af37]"
            placeholder="Ex: 11999998888"
          />
        </label>

        <label className="mt-3 block text-xs uppercase tracking-wide text-white/45">
          Status (opcional)
          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#d4af37]"
            placeholder="Uma frase ou emoji"
          />
        </label>

        <label className="mt-3 block text-xs uppercase tracking-wide text-white/45">
          Avatar URL (opcional)
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#d4af37]"
            placeholder="https://..."
          />
        </label>

        {isEdit && (
          <label className="mt-3 block text-xs uppercase tracking-wide text-white/45">
            Score
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#d4af37]"
            />
          </label>
        )}

        {error && (
          <p className="mt-3 text-sm text-[#ff7a9a]" role="alert">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2 pb-2">
          <button
            type="submit"
            disabled={pending}
            className="btn-press rounded-full bg-[#e84a7f] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Salvando..." : isEdit ? "Salvar" : "Adicionar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-press hidden rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/80 sm:inline-flex"
          >
            Cancelar
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={onDelete}
              disabled={pending}
              className="btn-press ml-auto rounded-full border border-red-400/30 px-4 py-2.5 text-sm text-red-300"
            >
              Excluir
            </button>
          )}
        </div>
      </form>
    </ModalSheet>
  );
}
