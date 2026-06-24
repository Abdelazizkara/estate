import { Server } from "socket.io";
import crypto from "crypto";

export function setupSocket(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const anonymousUser = `User-${socket.id.substring(0, 4)}`;
    console.log(`Public user joined: ${anonymousUser}`);

    socket.on("send-global-message", ({ username, content }) => {
      const publicMsg = {
        id: crypto.randomUUID(),
        username: username || anonymousUser,
        content,
        createdAt: new Date().toISOString(),
      };

      io.emit("new-global-message", publicMsg);
    });

    socket.on("disconnect", () => {
      console.log(`Public user left: ${anonymousUser}`);
    });
  });

  return io;
}
