import { Character } from "../util/characters";

export type Player = {
  name: string;
  order: number;
  character: Character;
};
