export type UserRole = "editor" | "helper" | "public";

export interface Lobby {
  id: string;
  name: string;
  created_at: string;
}

export interface TableData {
  id: string;
  lobby_id: string;
  number: string;
  seats: number;
  status: "available" | "occupied";
  reserved: boolean;
  created_at: string;
  updated_at: string;
  lobbies?: { name: string };
}
