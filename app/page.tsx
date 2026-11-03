import { Suspense } from "react";
import { connection } from "next/server";
import { Dashboard } from "@/components/Dashboard";
import { listFriends, listIncidents } from "@/lib/queries";

async function RankingBoard() {
  await connection();
  const [friends, incidents] = await Promise.all([
    listFriends(),
    listIncidents(30),
  ]);

  return <Dashboard friends={friends} incidents={incidents} />;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-white/50">
          Carregando o ranking...
        </div>
      }
    >
      <RankingBoard />
    </Suspense>
  );
}
