"use server";

import { revalidatePath } from "next/cache";
import { ensureSchema, getDb } from "./db";
import { countFriends } from "./queries";
import type { FriendInput } from "./types";
import { MAX_FRIENDS } from "./types";

function clean(value?: string | null) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length ? trimmed : null;
}

export async function adjustScore(
  friendId: number,
  delta: number,
  reason?: string | null
) {
  if (delta !== 1 && delta !== -1) {
    throw new Error("Delta must be +1 or -1");
  }

  const motivo = clean(reason);
  if (!motivo) {
    throw new Error("Motivo é obrigatório");
  }

  const db = getDb();
  await ensureSchema(db);

  await db.batch(
    [
      {
        sql: `UPDATE friends
              SET score = score + ?, updated_at = datetime('now')
              WHERE id = ?`,
        args: [delta, friendId],
      },
      {
        sql: `INSERT INTO incidents (friend_id, delta, reason)
              VALUES (?, ?, ?)`,
        args: [friendId, delta, motivo],
      },
    ],
    "write"
  );

  revalidatePath("/");
}

export async function createFriend(input: FriendInput) {
  const name = input.name.trim();
  if (!name) throw new Error("Nome é obrigatório");

  const total = await countFriends();
  if (total >= MAX_FRIENDS) {
    throw new Error(`Limite de ${MAX_FRIENDS} amigos atingido`);
  }

  const db = getDb();
  await ensureSchema(db);
  await db.execute({
    sql: `INSERT INTO friends (name, status, avatar_url, score)
          VALUES (?, ?, ?, 0)`,
    args: [name, clean(input.status), clean(input.avatarUrl)],
  });

  revalidatePath("/");
}

export async function updateFriend(id: number, input: FriendInput) {
  const name = input.name.trim();
  if (!name) throw new Error("Nome é obrigatório");

  const db = getDb();
  await ensureSchema(db);

  if (typeof input.score === "number" && Number.isFinite(input.score)) {
    await db.execute({
      sql: `UPDATE friends
            SET name = ?, status = ?, avatar_url = ?, score = ?,
                updated_at = datetime('now')
            WHERE id = ?`,
      args: [
        name,
        clean(input.status),
        clean(input.avatarUrl),
        Math.round(input.score),
        id,
      ],
    });
  } else {
    await db.execute({
      sql: `UPDATE friends
            SET name = ?, status = ?, avatar_url = ?,
                updated_at = datetime('now')
            WHERE id = ?`,
      args: [name, clean(input.status), clean(input.avatarUrl), id],
    });
  }

  revalidatePath("/");
}

export async function deleteFriend(id: number) {
  const db = getDb();
  await ensureSchema(db);
  await db.execute({
    sql: "DELETE FROM incidents WHERE friend_id = ?",
    args: [id],
  });
  await db.execute({
    sql: "DELETE FROM friends WHERE id = ?",
    args: [id],
  });
  revalidatePath("/");
}
