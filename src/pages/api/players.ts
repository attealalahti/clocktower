import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { Player } from "../../types/api-types";
import { Character, characters, CharId } from "../../util/characters";

const players = async (req: NextApiRequest, res: NextApiResponse) => {
  const players = await prisma.player.findMany();
  const playersWithCharacters: Player[] = players.map((player) => {
    return {
      name: player.name,
      character: characters.get(player.role as CharId) as Character,
    };
  });
  res.status(200).json(playersWithCharacters);
};

export default players;
