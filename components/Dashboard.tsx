"use client";

import { useCallback, useRef, useState } from "react";
import type { Friend, Incident } from "@/lib/types";
import { Fireworks, type FireworksHandle } from "./Fireworks";
import { FriendFormModal } from "./FriendFormModal";
import { Header } from "./Header";
import { IncidentFeed } from "./IncidentFeed";
import { IncidentModal } from "./IncidentModal";
import { Leaderboard } from "./Leaderboard";
import { Podium } from "./Podium";
import { SideDrawer } from "./SideDrawer";

type Props = {
  friends: Friend[];
  incidents: Incident[];
};

export function Dashboard({ friends, incidents }: Props) {
  const [friendModalOpen, setFriendModalOpen] = useState(false);
  const [editing, setEditing] = useState<Friend | null>(null);
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [preselectedId, setPreselectedId] = useState<number | null>(null);
  const [preselectedDelta, setPreselectedDelta] = useState<1 | -1>(1);
  const [tableOpen, setTableOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);
  const fireworksRef = useRef<FireworksHandle | null>(null);

  const registerFireworks = useCallback((handle: FireworksHandle) => {
    fireworksRef.current = handle;
  }, []);

  const celebratePlusOne = useCallback((origin?: { x: number; y: number }) => {
    fireworksRef.current?.celebrate(origin);
  }, []);

  function openAddFriend() {
    setEditing(null);
    setFriendModalOpen(true);
  }

  function openEdit(friend: Friend) {
    setEditing(friend);
    setFriendModalOpen(true);
  }

  function openIncident(friend?: Friend, delta: 1 | -1 = 1) {
    setPreselectedId(friend?.id ?? null);
    setPreselectedDelta(delta);
    setIncidentOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-24 sm:py-8 lg:pb-8">
      <Fireworks register={registerFireworks} />

      <Header
        onAddFriend={openAddFriend}
        onRegisterIncident={() => openIncident()}
      />

      <Podium
        friends={friends}
        onEdit={openEdit}
        onMotivo={(friend, delta) => openIncident(friend, delta ?? 1)}
      />

      <div className="mt-6 flex gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setTableOpen(true)}
          className="btn-press flex-1 rounded-2xl border border-white/12 bg-white/5 px-3 py-3 text-sm font-medium text-white/90"
        >
          Tabela completa
        </button>
        <button
          type="button"
          onClick={() => setFeedOpen(true)}
          className="btn-press flex-1 rounded-2xl border border-white/12 bg-white/5 px-3 py-3 text-sm font-medium text-white/90"
        >
          Ocorrências
        </button>
      </div>

      <div className="mt-8 hidden gap-5 lg:grid lg:grid-cols-[1.4fr_0.9fr]">
        <Leaderboard
          friends={friends}
          onEdit={openEdit}
          onMotivo={(friend, delta) => openIncident(friend, delta ?? 1)}
        />
        <IncidentFeed incidents={incidents} />
      </div>

      <SideDrawer
        open={tableOpen}
        onClose={() => setTableOpen(false)}
        side="left"
        title="Tabela Completa"
      >
        <Leaderboard
          friends={friends}
          onEdit={(friend) => {
            setTableOpen(false);
            openEdit(friend);
          }}
          onMotivo={(friend, delta) => {
            setTableOpen(false);
            openIncident(friend, delta ?? 1);
          }}
          embedded
        />
      </SideDrawer>

      <SideDrawer
        open={feedOpen}
        onClose={() => setFeedOpen(false)}
        side="right"
        title="Ocorrências"
      >
        <IncidentFeed incidents={incidents} embedded />
      </SideDrawer>

      <FriendFormModal
        open={friendModalOpen}
        friend={editing}
        onClose={() => {
          setFriendModalOpen(false);
          setEditing(null);
        }}
      />

      <IncidentModal
        open={incidentOpen}
        friends={friends}
        preselectedId={preselectedId}
        preselectedDelta={preselectedDelta}
        onClose={() => setIncidentOpen(false)}
        onPlusOne={celebratePlusOne}
      />
    </div>
  );
}
