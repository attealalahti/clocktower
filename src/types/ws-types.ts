import { Character } from "../util/characters";

export interface ServerToClientEvents {
  data: (data: { name: string; character: Character }) => void;
  playerDataChanged: () => void;
  playerRemoved: () => void;
}

export interface ClientToServerEvents {
  ready: (id: number) => void;
  changeName: (name: string, id: number) => void;
  removePlayer: (id: number) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: number;
}
