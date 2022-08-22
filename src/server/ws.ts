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
const nameSchema = z.string();

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
        nameSchema.parse(player?.name);
        const data = {
          name: player?.name as string,
          role: getCharacter(player?.role as CharId),
        };
        socket.emit("data", data);
      } catch (err) {
        console.log(err);
      }
    });
    socket.on("changeName", async (name: string, id: number) => {
      try {
        nameSchema.parse(name);
        idSchema.parse(id);
        await prisma.player.update({ data: { name }, where: { id } });
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
