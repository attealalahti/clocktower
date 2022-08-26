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
        socket.join(id.toString());
        const player = await prisma.player.findFirst({ where: { id } });
        CharIdSchema.parse(player?.role);
        nameSchema.parse(player?.name);
        const data = {
          name: player?.name as string,
          character: getCharacter(player?.role as CharId),
        };
        socket.emit("playerData", data);
        io.emit("playerDataChanged");
      } catch (err) {
        socket.emit("playerRemoved");
      }
    });
    socket.on("changeName", async (name: string, id: number) => {
      try {
        nameSchema.parse(name);
        idSchema.parse(id);
        await prisma.player.update({ data: { name }, where: { id } });
        io.emit("playerDataChanged");
      } catch (err) {
        console.log(err);
      }
    });
    socket.on("removePlayer", async (id: number) => {
      await prisma.player.delete({ where: { id } });
      io.to(id.toString()).emit("playerRemoved");
    });
    socket.on("sendCharacters", (ids: number[]) => {
      ids.forEach(async (id) => {
        const player = await prisma.player.findFirst({ where: { id } });
        if (player) {
          const data = {
            name: player.name as string,
            character: getCharacter(player.stRole as CharId),
          };
          io.to(id.toString()).emit("playerData", data);
          await prisma.player.update({
            data: { role: player.stRole },
            where: { id: player.id },
          });
        }
      });
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
