import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { getCharacter, CharIdSchema, CharId } from "../util/characters";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { ServerEmit, ClientEmit } from "../util/ws-enums";

const prisma = new PrismaClient();
const idSchema = z.number();

export default function ws(server: Server) {
  const io = new SocketIOServer(server);
  io.on(ClientEmit.Connection, (socket) => {
    console.log(`++ Connect ${socket.id} (${io.engine.clientsCount})`);
    socket.on(ClientEmit.Ready, async (id: number) => {
      try {
        idSchema.parse(id);
        const player = await prisma.player.findFirst({ where: { id } });
        CharIdSchema.parse(player?.role);
        socket.emit(ServerEmit.Role, getCharacter(player?.role as CharId));
      } catch (err) {
        console.log(err);
      }
    });
    socket.on(ClientEmit.Disconnect, (reason: string) => {
      console.log(
        `-- Disconnect ${socket.id} due to ${reason} (${io.engine.clientsCount})`
      );
    });
  });
}
