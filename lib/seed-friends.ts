import seed from "./seed-friends.json";

/** Editable roster (see seed-friends.json). Run `npm run seed` after changes. */
export const SEED_FRIENDS: { name: string; status?: string; phone?: string }[] =
  seed;
