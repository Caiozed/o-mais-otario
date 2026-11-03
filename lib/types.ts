export type Friend = {
  id: number;
  name: string;
  status: string | null;
  avatar_url: string | null;
  phone: string | null;
  score: number;
  created_at: string;
  updated_at: string;
};

export type Incident = {
  id: number;
  friend_id: number;
  delta: number;
  reason: string | null;
  created_at: string;
  friend_name?: string;
};

export type FriendInput = {
  name: string;
  status?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  score?: number;
};

export const MAX_FRIENDS = 25;
