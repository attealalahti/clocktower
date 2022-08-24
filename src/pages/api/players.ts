import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { Player } from "../../types/api-types";
import { Character, characters, CharId } from "../../util/characters";

const players = async (req: NextApiRequest, res: NextApiResponse) => {
  const players = await prisma.player.findMany();
  const playersWithCharacters: Player[] = players.map(
    ({ name, order, stRole }) => {
      return {
        name,
        order,
        character: characters.get(stRole as CharId) as Character,
      };
    }
  );
  playersWithCharacters.sort((a, b) => a.order - b.order);
  res.status(200).json(playersWithCharacters);
};

export default players;
