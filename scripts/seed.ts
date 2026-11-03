import "dotenv/config";
import { createClient } from "@libsql/client";
import { SEED_FRIENDS } from "../lib/seed-friends";

async function main() {
  const url = process.env.TURSO_DATABASE_URL ?? "file:local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const db = createClient(authToken ? { url, authToken } : { url });

  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        status TEXT,
        avatar_url TEXT,
        score INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
      `CREATE TABLE IF NOT EXISTS incidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        friend_id INTEGER NOT NULL,
        delta INTEGER NOT NULL,
        reason TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (friend_id) REFERENCES friends(id) ON DELETE CASCADE
      )`,
    ],
    "write"
  );

  await db.execute("DELETE FROM incidents");
  await db.execute("DELETE FROM friends");

  for (const friend of SEED_FRIENDS) {
    await db.execute({
      sql: "INSERT INTO friends (name, status, score) VALUES (?, ?, 0)",
      args: [friend.name, friend.status ?? null],
    });
  }

  console.log(`Seeded ${SEED_FRIENDS.length} friends into ${url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
