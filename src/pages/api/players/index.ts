import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import { Player, PlayerToServer, Tokens } from "../../../types/api-types";
import { Character, characters, CharId } from "../../../util/characters";
import { playerToServerArraySchema } from "../../../types/api-types";
import { player, Prisma } from "@prisma/client";

const players = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body) {
    try {
      playerToServerArraySchema.parse(req.body);
      const players = req.body as PlayerToServer[];
      const updates: Prisma.Prisma__playerClient<player>[] = [];
      players.forEach((player) => {
        if (player.tokens === null) {
          player.tokens = undefined;
        }
        updates.push(
          prisma.player.update({
            where: {
              id: player.id,
            },
            data: {
              name: player.name,
              order: player.order,
              stRole: player.stRole,
              tokens: player.tokens,
              dead: player.dead,
            },
          })
        );
      });
      await prisma.$transaction(updates);
      res.status(200).send("Updated successfully.");
    } catch (err) {
      console.log(err);
      res.status(400).send("Invalid request.");
    }
  } else {
    const players = await prisma.player.findMany();
    const playersWithCharacters: Player[] = players.map(
      ({ id, name, order, stRole, tokens, dead }) => {
        return {
          id,
          name,
          order,
          character: characters.get(stRole as CharId) as Character,
          tokens: tokens as Tokens,
          dead,
        };
      }
    );
    playersWithCharacters.sort((a, b) => a.order - b.order);
    res.status(200).json(playersWithCharacters);
  }
};

export default players;
