import { Character } from "../util/characters";
import { z } from "zod";

export type Tokens = {
  butlerMaster?: boolean;
  isTheDrunk?: boolean;
  fortuneTellerRedHerring?: boolean;
  investigatorDecoy?: boolean;
  investigatorMinion?: boolean;
  librarianDecoy?: boolean;
  librarianOutsider?: boolean;
  monkProtected?: boolean;
  poisonerPoisoned?: boolean;
  scarletWomanDemon?: boolean;
  undertakerExecuted?: boolean;
  virginUsed?: boolean;
  washerwomanTownsfolk?: boolean;
  washerwomanDecoy?: boolean;
};

export type Player = {
  id: number;
  name: string;
  order: number;
  character: Character;
  tokens: Tokens;
  dead: boolean;
};

export const playerToServerSchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number(),
  stRole: z.string(),
  tokens: z.any(),
  dead: z.boolean(),
});

export const playerToServerArraySchema = playerToServerSchema.array();

export type PlayerToServer = z.infer<typeof playerToServerSchema>;
