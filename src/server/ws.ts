import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { getCharacter, CharIdSchema, CharId } from "../util/characters";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../types/ws-types";

const prisma = new PrismaClient();
const idSchema = z.number();

export default function ws(server: Server) {
  const io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server);
  io.on("connect", (socket) => {
    console.log(
      `++ ${Date()} Connect ${socket.id} (${io.engine.clientsCount})`
    );
    socket.on("ready", async (id: number) => {
      try {
        idSchema.parse(id);
        const player = await prisma.player.findFirst({ where: { id } });
        CharIdSchema.parse(player?.role);
        socket.emit("role", getCharacter(player?.role as CharId));
      } catch (err) {
        console.log(err);
      }
    });
    socket.on("disconnect", (reason: string) => {
      console.log(
        `-- ${Date()} Disconnect ${socket.id} due to ${reason} (${
          io.engine.clientsCount
        })`
      );
    });
  });
}
