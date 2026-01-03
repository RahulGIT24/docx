import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Document } from "@/types/types";
import { generateCollabToken } from "@/lib/getCollabToken";
import { useCollabStore } from "@/store/use-collab-store";
import * as Y from "yjs";

export function useCollaboration(document: Document) {
  const router = useRouter();
  const {
    socket,
    connect,
    disconnect,
    setYDoc,
    collabToken,
    setCollabToken,
  } = useCollabStore();

  const yDocRef = useRef<null | Y.Doc>(null)

  function startYjs(ws: WebSocket, docId: number) {
    const ydoc = new Y.Doc();
    const json = document.json
    const type = ydoc.getXmlFragment('content')
    if (json && type.length == 0) {

    }
    yDocRef.current = ydoc
    setYDoc(ydoc);

    ydoc.on("update", (update: Uint8Array) => {
      ws.send(update);
    });

    ws.addEventListener("message", (event) => {
      if (event.data instanceof ArrayBuffer) {
        const update = new Uint8Array(event.data);
        Y.applyUpdate(ydoc, update);
      }
    });
  }


  useEffect(() => {
    if (!document?.editAccess) return;

    const init = async () => {
      let token = collabToken;
      if (!token) {
        token = await generateCollabToken();
        setCollabToken(token);
      }
      connect(token!);
    };

    init();
  }, [document]);

  useEffect(() => {
    if (!socket || !document?.editAccess) return;

    const join = () => {
      socket.send(
        JSON.stringify({
          type: "request-collab",
          data: document.sharingToken,
        })
      );
    };

    socket.readyState === WebSocket.OPEN
      ? join()
      : socket.addEventListener("open", join, { once: true });
  }, [socket, document]);

  useEffect(() => {
    if (!socket) return;

    const onMessage = async (e: MessageEvent) => {
      if (typeof e.data === 'string') {
        const msg = JSON.parse(e.data);

        if (msg.type === "collab-approved") {
          console.log("Collaboration approved for doc:", msg.docId);
          startYjs(socket, document.id)
          return;
        }

        if (msg.type !== "error") return;

        switch (msg.data) {
          case "Token Expired": {
            disconnect();
            const token = await generateCollabToken();
            setCollabToken(token);
            connect(token);
            break;
          }

          case "Room is full (max 3 users)": {
            disconnect();
            toast.info("Max users reached. View-only mode.");
            break;
          }

          case "Invalid Token": {
            let retry = 0
            while (retry <= 2) {
              disconnect();
              const token = await generateCollabToken();
              setCollabToken(token);
              connect(token);
              retry++
            }
            toast.error("Authentication failed");
            router.push("/");
            break;
          }
        }
      }
    };

    socket.addEventListener("message", onMessage);
    return () => socket.removeEventListener("message", onMessage);
  }, [socket]);

  useEffect(() => () => {
    disconnect()
  }, []);
}
