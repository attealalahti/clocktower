import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { getCharacter } from "../util/characters";

export default function ws(server: Server) {
  const io = new SocketIOServer(server);
  io.on("connection", (socket) => {
    console.log(`++ connect ${socket.id} (${io.engine.clientsCount})`);
    socket.on("ready", () => {
      socket.emit("role", getCharacter("empath"));
    });
    socket.on("disconnect", (reason) => {
      console.log(
        `-- disconnect ${socket.id} due to ${reason} (${io.engine.clientsCount})`
      );
    });
  });
}
