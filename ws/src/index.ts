import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { decodeToken } from "./lib/tokenDecoder";
import { Database } from "./lib/db";

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;
const TOKEN_SECRET = process.env.TOKEN_SECRET!;
const db = new Database(process.env.DATABASE_URL!);

// docId -> Set<userId>
const activeRooms = new Map<string, Set<string>>();

const wss = new WebSocketServer({ port: PORT });

function reject(ws: WebSocket, message: string) {
    ws.send(JSON.stringify({ type: "error", data: message }));
    ws.close();
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

    ws.onmessage = async (event) => {
        const raw = event.data
        let msg: any;

        try {
            msg = JSON.parse(raw.toString());
        } catch {
            return reject(ws, "Invalid JSON");
        }

        if (msg.type !== "request-collab") return;

        const docToken = msg.data;
        if (!docToken) return reject(ws, "Document token Not found");

        const docId = await db.isDocAccessible(docToken);
        if (!docId) return reject(ws, "Document is not for editing");

        // room limit check
        const room = activeRooms.get(docId) ?? new Set<string>();
        if (room.has(userId)) return reject(ws, "Already connected");
        if (room.size >= 3) return reject(ws, "Room is full (max 3 users)");

        room.add(userId);
        activeRooms.set(docId, room);

        (ws as any).__docId = docId;
        (ws as any).__userId = userId;

        ws.send(
            JSON.stringify({
                type: "collab-approved",
                docId,
            })
        );
    };

    ws.onclose = () => {
        const docId = (ws as any).__docId;
        const userId = (ws as any).__userId;

        if (!docId || !userId) return;

        const room = activeRooms.get(docId);
        room?.delete(userId);
        if (room?.size === 0) activeRooms.delete(docId);
    };
});

console.log(`Control WS running on :${PORT}`);
