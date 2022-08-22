import type { Character } from "../util/characters";

export interface ServerToClientEvents {
  data: ({ name, role }: { name: string; role: Character }) => void;
}

export interface ClientToServerEvents {
  ready: (id: number) => void;
  changeName: (name: string, id: number) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: number;
}
