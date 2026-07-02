import { Router } from "express";
import { getPrisma } from "../lib/prisma.js";
import { getTokenFromRequest } from "../lib/authCookie.js";
import { verifyAuthToken } from "../lib/verifyToken.js";

const router = Router();

function requireAuth(req: any, res: any) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyAuthToken(token) : null;
  if (!payload) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
  return payload;
}

// list my conversations, newest first, with last message + other participant
router.get("/", async (req, res) => {
  const payload = requireAuth(req, res);
  if (!payload) return;
  const db = getPrisma();
  if (!db) return res.status(500).json({ error: "Database is not configured" });

  const conversations = await db.conversation.findMany({
    where: { participants: { some: { userId: payload.userId } } },
    include: {
      participants: { include: { user: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      property: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  res.json({
    conversations: conversations.map((c) => ({
      id: c.id,
      property: c.property
        ? { id: c.property.id, title: c.property.title }
        : null,
      otherUser: (() => {
        const other = c.participants.find(
          (p) => p.userId !== payload.userId,
        )?.user;
        return other
          ? { id: other.id, name: other.name, role: other.role }
          : null;
      })(),
      lastMessage: c.messages[0]
        ? { content: c.messages[0].content, createdAt: c.messages[0].createdAt }
        : null,
    })),
  });
});

// start (or fetch existing) conversation with another user
router.post("/", async (req, res) => {
  const payload = requireAuth(req, res);
  if (!payload) return;
  const { userId, propertyId } = req.body as {
    userId?: string;
    propertyId?: string;
  };
  if (!userId) return res.status(400).json({ error: "userId is required" });

  const db = getPrisma();
  if (!db) return res.status(500).json({ error: "Database is not configured" });

  const existing = await db.conversation.findFirst({
    where: {
      propertyId: propertyId ?? null,
      AND: [
        { participants: { some: { userId: payload.userId } } },
        { participants: { some: { userId } } },
      ],
    },
  });
  if (existing) return res.json({ conversation: { id: existing.id } });

  const conversation = await db.conversation.create({
    data: {
      propertyId: propertyId ?? null,
      participants: { create: [{ userId: payload.userId }, { userId }] },
    },
  });
  res.status(201).json({ conversation: { id: conversation.id } });
});

// message history for one conversation
router.get("/:id/messages", async (req, res) => {
  const payload = requireAuth(req, res);
  if (!payload) return;
  const db = getPrisma();
  if (!db) return res.status(500).json({ error: "Database is not configured" });

  const participant = await db.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId: req.params.id,
        userId: payload.userId,
      },
    },
  });
  if (!participant) return res.status(403).json({ error: "Not a participant" });

  const messages = await db.message.findMany({
    where: { conversationId: req.params.id },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  });

  res.json({
    messages: messages.map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt,
      sender: { id: m.sender.id, name: m.sender.name },
    })),
  });
});

export default router;
