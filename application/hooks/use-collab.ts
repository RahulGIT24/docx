import { generateCollabToken } from "@/lib/getCollabToken";
import { useCollabStore } from "@/store/use-collab-store";
import { Document } from "@/types/types";
import { useEffect } from "react";

export function useCollaboration(document: Document) {
    const { socket, connect, disconnect, collabToken, setCollabToken } =
        useCollabStore();

    useEffect(() => {
        if (!document?.editAccess) return;

        const init = async () => {
            let token = collabToken;

            if (!token) {
                token = await generateCollabToken();
                setCollabToken(token);
            }

            connect(token as string);
        };

        init();
    }, [document]);

    useEffect(() => {
        if (!socket || !document?.editAccess) return;

        const join = () =>
            socket.send(
                JSON.stringify({
                    type: "collab",
                    data: document.sharingToken,
                })
            );

        socket.readyState === WebSocket.OPEN
            ? join()
            : socket.addEventListener("open", join, { once: true });
    }, [socket, document]);

    useEffect(() => {
        if (!socket) return;

        const onMessage = async (e: MessageEvent) => {
            const msg = JSON.parse(e.data);
            if (msg.type !== "error") return;

            if (msg.data === "Token Expired") {
                disconnect();
            }
        };

        socket.addEventListener("message", onMessage);
        return () => socket.removeEventListener("message", onMessage);
    }, [socket]);

    useEffect(() => () => disconnect(), []);
}
