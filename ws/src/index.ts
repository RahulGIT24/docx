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

// doctId -> Y.Doc
const yDocs = new Map<string, Y.Doc>();

// docId -> Set<userId>
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

function broadcast(docId: string, sender: WebSocket, data: Buffer) {
    const room = activeRooms.get(docId);
    if (!room) return;

    for (const client of room) {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    }
}

wss.on("connection", (ws: WebSocket, req) => {
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

    ws.on('message', async (data, isBinary) => {
        if (isBinary) {
            const docId = (ws as any).__docId;
            if (!docId) return;

            const ydoc = yDocs.get(docId);
            if (!ydoc) return;

            // Apply update
            Y.applyUpdate(ydoc, new Uint8Array(data as Buffer));

            // Broadcast to others
            broadcast(docId, ws, data as Buffer);
            return;
        }

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

        // room limit check
        const room = activeRooms.get(docId) ?? new Set<WebSocket>();
        if (room.size >= 3) return reject(ws, "Room is full (max 3 users)");

        room.add(ws);
        activeRooms.set(docId, room);

        (ws as any).__docId = docId;
        (ws as any).__userId = userId;

        const ydoc = getOrCreateYDoc(docId);

        ws.send(
            JSON.stringify({
                type: "collab-approved",
                docId,
            })
        );

        const syncUpdate = Y.encodeStateAsUpdate(ydoc);
        ws.send(syncUpdate);
    });

    ws.onclose = () => {
        const docId = (ws as any).__docId;
        const userId = (ws as any).__userId;

        if (!docId || !userId) return;

        const room = activeRooms.get(docId);
        room?.delete(ws);
        if (room?.size === 0) activeRooms.delete(docId);
    };
});

console.log(`Control WS running on :${PORT}`);
