import { Server } from "socket.io";
import crypto from "crypto";
import { verifyAuthToken } from "./lib/verifyToken.js";
import { AUTH_COOKIE } from "./lib/authCookie.js";
import { getPrisma } from "./lib/prisma.js";

interface AuthedUser {
  userId: string;
  email: string;
  role: string;
}

declare module "socket.io" {
  interface Socket {
    user?: AuthedUser;
  }
}

function parseCookies(header?: string): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    }),
  );
}

export function setupSocket(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const token = cookies[AUTH_COOKIE];
    if (token) {
      const payload = verifyAuthToken(token);
      if (payload) socket.user = payload as unknown as AuthedUser;
    }
    next(); // anonymous still allowed, for the global chat
  });

  io.on("connection", (socket) => {
    const anonymousUser = `User-${socket.id.substring(0, 4)}`;

    // ---- existing global chat, unchanged ----
    socket.on("send-global-message", ({ username, content }) => {
      const publicMsg = {
        id: crypto.randomUUID(),
        username: username || anonymousUser,
        content,
        createdAt: new Date().toISOString(),
      };
      io.emit("new-global-message", publicMsg);
    });

    // ---- private conversations ----
    socket.on("join-conversation", (conversationId: string) => {
      if (!socket.user) return;
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("leave-conversation", (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on(
      "send-message",
      async ({
        conversationId,
        content,
      }: {
        conversationId: string;
        content: string;
      }) => {
        if (!socket.user || !content?.trim()) return;
        const db = getPrisma();
        if (!db) return;

        const message = await db.message.create({
          data: {
            conversationId,
            senderId: socket.user.userId,
            content: content.trim(),
          },
          include: { sender: true },
        });

        io.to(`conversation:${conversationId}`).emit("new-message", {
          id: message.id,
          conversationId,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
          sender: { id: message.sender.id, name: message.sender.name },
        });
      },
    );

    socket.on("disconnect", () => {});
  });

  return io;
}
