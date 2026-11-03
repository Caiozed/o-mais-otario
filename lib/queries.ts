import { ensureSchema, getDb } from "./db";
import type { Friend, Incident } from "./types";

/** LibSQL rows are class instances — must be plain objects for Client Components. */
function plain<T>(row: unknown): T {
  return JSON.parse(JSON.stringify(row)) as T;
}

export async function listFriends(): Promise<Friend[]> {
  const db = getDb();
  await ensureSchema(db);
  const result = await db.execute(
    "SELECT * FROM friends ORDER BY score DESC, name ASC"
  );
  return result.rows.map((row) => plain<Friend>(row));
}

export async function listIncidents(limit = 30): Promise<Incident[]> {
  const db = getDb();
  await ensureSchema(db);
  const result = await db.execute({
    sql: `SELECT i.*, f.name AS friend_name
          FROM incidents i
          JOIN friends f ON f.id = i.friend_id
          ORDER BY i.created_at DESC
          LIMIT ?`,
    args: [limit],
  });
  return result.rows.map((row) => plain<Incident>(row));
}

export async function countFriends(): Promise<number> {
  const db = getDb();
  await ensureSchema(db);
  const result = await db.execute("SELECT COUNT(*) AS c FROM friends");
  return Number(result.rows[0]?.c ?? 0);
}
