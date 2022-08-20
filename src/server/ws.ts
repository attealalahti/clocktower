import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { getCharacter, CharacterEnum, CharacterID } from "../util/characters";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const idSchema = z.number();

export default function ws(server: Server) {
  const io = new SocketIOServer(server);
  io.on("connection", (socket) => {
    console.log(`++ Connect ${socket.id} (${io.engine.clientsCount})`);
    socket.on("ready", async (id) => {
      try {
        idSchema.parse(id);
        const player = await prisma.player.findFirst({ where: { id } });
        CharacterEnum.parse(player?.role);
        socket.emit("role", getCharacter(player?.role as CharacterID));
      } catch (err) {
        console.log(err);
      }
    });
    socket.on("disconnect", (reason) => {
      console.log(
        `-- Disconnect ${socket.id} due to ${reason} (${io.engine.clientsCount})`
      );
    });
  });
}
