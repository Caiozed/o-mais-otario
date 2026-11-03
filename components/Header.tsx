"use client";

type Props = {
  onAddFriend: () => void;
  onRegisterIncident: () => void;
};

export function Header({ onAddFriend, onRegisterIncident }: Props) {
  return (
    <header className="anim-fade-up flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div
          className="anim-devil flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#9b6bff,#3b1d6d)] text-xl shadow-[0_0_24px_rgba(155,107,255,0.35)]"
          aria-hidden
        >
          😈
        </div>
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl leading-none tracking-wide text-[#f3e7c6] sm:text-3xl">
            O mais otário
          </p>
          <p className="mt-1 text-sm text-white/55">
            Eleição oficial mensal das piores traquinagens do grupo
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAddFriend}
          className="btn-press rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
        >
          Adicionar amigo
        </button>
        <button
          type="button"
          onClick={onRegisterIncident}
          className="btn-press rounded-full bg-[#e84a7f] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(232,74,127,0.35)] hover:brightness-110"
        >
          Registrar Canalhice
        </button>
      </div>
    </header>
  );
}

