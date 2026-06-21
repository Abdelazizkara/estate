# TODO - Messaging system (WebSocket)

## Plan confirmation (done)
- Messaging scope: **1:1 direct messaging between any two users**.

## Steps
1. Update Prisma schema: add `Conversation` + `ConversationParticipant` + `Message` models.
2. Generate/apply DB changes (prisma generate/push or migrations).
3. Refactor backend startup to attach WebSocket server to the HTTP server (`backend/src/index.ts`).
4. Implement WS authentication using existing JWT httpOnly cookie verification.
5. Define and implement WS protocol:
   - client: `conversation:join`, `message:send`
   - server: `message:new`, `message:error`
6. Implement backend message persistence + authorization (sender must be a conversation participant).
7. Add REST endpoints:
   - `GET /api/conversations`
   - `GET /api/conversations/:id/messages?cursor=&limit=`
   - (optional) `POST /api/conversations` to create/find conversation with target userId.
8. Implement in-memory connection registry (userId -> sockets) and broadcast `message:new`.
9. Frontend: add WebSocket client service with reconnect/backoff.
10. Frontend: add chat store (messages + conversations) and wire WS events.
11. Frontend UI:
    - Messaging page (conversation list or direct conversation view)
    - message composer
12. End-to-end manual tests with two logged-in users:
    - send/receive without refresh
    - refresh recipient and confirm history loads via REST
13. Hardening:
    - rate limit `message:send`
    - payload length limits
    - sanitize content

