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

function normalizePhone(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  if (digits.length >= 10 && digits.length <= 11) return `55${digits}`;
  return digits;
}

await db.batch(
  [
    `CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT,
      avatar_url TEXT,
      phone TEXT,
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

try {
  await db.execute("ALTER TABLE friends ADD COLUMN phone TEXT");
} catch {
  // already exists
}

const existing = await db.execute("SELECT name FROM friends");
const names = new Set(existing.rows.map((r) => String(r.name)));

let added = 0;
for (const friend of friends) {
  if (names.has(friend.name)) continue;
  await db.execute({
    sql: "INSERT INTO friends (name, status, phone, score) VALUES (?, ?, ?, 0)",
    args: [friend.name, friend.status ?? null, normalizePhone(friend.phone)],
  });
  names.add(friend.name);
  added += 1;
}

if (added === 0 && existing.rows.length > 0) {
  console.log(`DB already has ${existing.rows.length} friends — nothing new to seed`);
} else if (existing.rows.length === 0) {
  console.log(`Seeded ${friends.length} friends into ${url}`);
} else {
  console.log(`Added ${added} missing friend(s); total names now ${names.size}`);
}
