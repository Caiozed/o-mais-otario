import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export function getDb(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL ?? "file:local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  client = createClient(authToken ? { url, authToken } : { url });

  return client;
}

export async function ensureSchema(db: Client = getDb()) {
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
      `CREATE INDEX IF NOT EXISTS idx_friends_score ON friends(score DESC, name ASC)`,
      `CREATE INDEX IF NOT EXISTS idx_incidents_created ON incidents(created_at DESC)`,
    ],
    "write"
  );

  // Existing DBs created before `phone` existed
  try {
    await db.execute("ALTER TABLE friends ADD COLUMN phone TEXT");
  } catch {
    // column already exists
  }
}
