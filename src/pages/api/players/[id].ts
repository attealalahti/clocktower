import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import { z } from "zod";
import { playerToServerSchema } from "../../../types/api-types";

const idSchema = z.number();

const player = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id: idString } = req.query;
    const id = parseInt(idString as string, 10);
    idSchema.parse(id);
    playerToServerSchema.parse(req.body);
    if (req.body.tokens === null) {
      req.body.tokens = undefined;
    }
    await prisma.player.update({
      where: {
        id,
      },
      data: {
        name: req.body.name,
        order: req.body.order,
        stRole: req.body.stRole,
        tokens: req.body.tokens,
        dead: req.body.dead,
      },
    });

    res.status(200).send("Updated successfully.");
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid request.");
  }
};

export default player;
