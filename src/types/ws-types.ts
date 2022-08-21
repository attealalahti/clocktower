import type { Character } from "../util/characters";

export interface ServerToClientEvents {
  role: (role: Character) => void;
}

export interface ClientToServerEvents {
  ready: (id: number) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: number;
}
