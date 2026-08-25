import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/properties.js";
import myPropertyRoutes from "./routes/myProperties.js";
import uploadRoutes from "./routes/uploads.js";
import conversationsRouter from "./routes/conversations.js";

import { setupSocket } from "./socket.js";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/my", myPropertyRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/conversations", conversationsRouter);

const server = http.createServer(app);

setupSocket(server);

export default server;
