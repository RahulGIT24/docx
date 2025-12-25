import { WebSocketServer } from 'ws';
import dotenv from 'dotenv'
import { decodeToken } from './lib/tokenDecoder';
import jwt from 'jsonwebtoken';
import { Database } from './lib/db';

dotenv.config()

const db = new Database();

const PORT = Number(process.env.PORT) || 8080;
const TOKEN_SECRET = process.env.TOKEN_SECRET!;

const rooms = new Map<string, Map<string, WebSocket>>();

const wss = new WebSocketServer({ port: PORT });

function joinRoom(
    ws: any,
    docId: string,
    userId: string
) {
    if (!rooms.has(docId)) {
        rooms.set(docId, new Map());
    }

    const room = rooms.get(docId)!;

    if (room.has(userId)) {
        ws.send(
            JSON.stringify({
                type: "error",
                data: "User already connected in this room",
            })
        );
        ws.close();
        return;
    }

    if (room.size >= 3) {
        ws.send(
            JSON.stringify({
                type: "error",
                data: "Room is full (max 3 users)",
            })
        );
        ws.close();
        return;
    }

    room.set(userId, ws);

    (ws as any).docId = docId;
    (ws as any).userId = userId;

    ws.send(
        JSON.stringify({
            type: "message",
            data: "Room joined successfully",
        })
    );
}

function leaveRoom(ws: any) {
    const docId = (ws as any).docId;
    const userId = (ws as any).userId;

    if (!docId || !userId) return;

    const room = rooms.get(docId);
    if (!room) return;

    room.delete(userId);

    if (room.size === 0) {
        rooms.delete(docId);
    }
}

wss.on("connection", (ws, req) => {
    const url = new URL(req.url as string);
    const auth_token = url.searchParams.get("token");
    let user_id = null;

    if (!auth_token) {
        ws.send(JSON.stringify({ "error": "Auth token Not found" }))
        ws.close();
        return;
    }

    try {
        const payload = JSON.parse(decodeToken(TOKEN_SECRET, auth_token) as string);
        user_id = payload?.id;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            ws.send(JSON.stringify({ "type": "error", "data": "Token Expired" }))
            ws.close();
            return;
        }
        if (err instanceof jwt.JsonWebTokenError) {
            ws.send(JSON.stringify({ "type": "error", "data": "Invalid Token" }))
            ws.close();
            return;
        }
        ws.send(JSON.stringify({ type: "error", data: "Invalid JSON" }));
        ws.close();
        return;
    }

    let parsed_msg;

    ws.on('message', async (message) => {
        try {
            parsed_msg = JSON.parse(message.toString());
        } catch {
            ws.send(JSON.stringify({ type: "error", data: "Invalid JSON" }));
            ws.close();
            return;
        }

        // type,data

        if (parsed_msg.type === 'collab') {
            const doc_token = parsed_msg.data;

            if (!doc_token) {
                ws.send(JSON.stringify({ "type": "error", "data": "Document token Not found" }))
                ws.close();
                return;
            }

            const doc_id = await db.isDocAccessible(doc_token);

            if (doc_id == null) {
                ws.send(JSON.stringify({ "type": "error", "data": "Document is not for editing" }))
                ws.close();
                return;
            }
            joinRoom(ws, doc_id, user_id)
        }
    })

    ws.on('close', () => {
        leaveRoom(ws);
    })

})