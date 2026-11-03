import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedPath = join(__dirname, "../lib/seed-friends.json");
const friends = JSON.parse(readFileSync(seedPath, "utf8"));

const url = process.env.TURSO_DATABASE_URL ?? "file:/data/local.db";
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

const count = await db.execute("SELECT COUNT(*) AS c FROM friends");
const existing = Number(count.rows[0]?.c ?? 0);

if (existing > 0) {
  console.log(`DB already has ${existing} friends — skip seed`);
  process.exit(0);
}

for (const friend of friends) {
  await db.execute({
    sql: "INSERT INTO friends (name, status, score) VALUES (?, ?, 0)",
    args: [friend.name, friend.status ?? null],
  });
}

console.log(`Seeded ${friends.length} friends into ${url}`);
