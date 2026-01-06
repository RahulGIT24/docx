import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { decodeToken } from "./lib/tokenDecoder";
import { Database } from "./lib/db";
import * as Y from "yjs";

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;
const TOKEN_SECRET = process.env.TOKEN_SECRET!;
const db = new Database(process.env.DATABASE_URL!);

// docId -> Y.Doc
const yDocs = new Map<string, Y.Doc>();

// docId -> Set<WebSocket>
const activeRooms = new Map<string, Set<WebSocket>>();

const wss = new WebSocketServer({ port: PORT });

function reject(ws: WebSocket, message: string) {
  ws.send(JSON.stringify({ type: "error", data: message }));
  ws.close();
}

function getOrCreateYDoc(docId: string) {
  let ydoc = yDocs.get(docId);
  if (!ydoc) {
    ydoc = new Y.Doc();
    yDocs.set(docId, ydoc);
  }
  return ydoc;
}

function broadcast(docId: string, sender: WebSocket, update: Buffer) {
  const room = activeRooms.get(docId);
  if (!room) return;

  for (const client of room) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(update);
    }
  }
}

wss.on("connection", (ws: WebSocket, req) => {
  ws.binaryType = "arraybuffer";

  // ---- AUTH ----
  const url = new URL(req.url!, `http://localhost:${PORT}`);
  const token = url.searchParams.get("token");

  if (!token) return reject(ws, "Auth token Not found");

  let userId: string;

  try {
    const payload = decodeToken(TOKEN_SECRET, token);
    userId = payload.userId;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError)
      return reject(ws, "Token Expired");

    return reject(ws, "Invalid Token");
  }

  // ---- CONNECTION STATE ----
  (ws as any).__docId = null;
  (ws as any).__userId = userId;
  (ws as any).__synced = false;

  ws.on("message", async (data, isBinary) => {
    // =========================
    // BINARY = YJS UPDATE
    // =========================
    if (isBinary) {
      const docId = (ws as any).__docId;
      if (!docId) return;

      // 🔒 Ignore updates until initial sync finishes
      if (!(ws as any).__synced) return;

      const ydoc = yDocs.get(docId);
      if (!ydoc) return;

      Y.applyUpdate(ydoc, new Uint8Array(data as Buffer));
      broadcast(docId, ws, data as Buffer);
      return;
    }

    // =========================
    // JSON = CONTROL MESSAGE
    // =========================
    let msg: any;
    try {
      msg = JSON.parse(data.toString());
    } catch {
      return reject(ws, "Invalid JSON");
    }

    if (msg.type !== "request-collab") return;

    const docToken = msg.data;
    if (!docToken) return reject(ws, "Document token Not found");

    const docId = await db.isDocAccessible(docToken);
    if (!docId) return reject(ws, "Document is not for editing");

    // ---- ROOM LIMIT ----
    const room = activeRooms.get(docId) ?? new Set<WebSocket>();
    if (room.size >= 3) return reject(ws, "Room is full (max 3 users)");

    room.add(ws);
    activeRooms.set(docId, room);

    (ws as any).__docId = docId;

    const ydoc = getOrCreateYDoc(docId);

    // ---- ACK ----
    ws.send(
      JSON.stringify({
        type: "collab-approved",
        docId,
      })
    );

    // ---- INITIAL SYNC (SERVER → CLIENT) ----
    const update = Y.encodeStateAsUpdate(ydoc);
    ws.send(update);

    // 🔑 Mark synced AFTER initial state is sent
    (ws as any).__synced = true;
  });

  ws.on("close", () => {
    const docId = (ws as any).__docId;
    if (!docId) return;

    const room = activeRooms.get(docId);
    room?.delete(ws);

    if (room && room.size === 0) {
      activeRooms.delete(docId);
    }
  });
});

console.log(`✅ Collaboration WS running on :${PORT}`);
