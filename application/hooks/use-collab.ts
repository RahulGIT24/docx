import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Document } from "@/types/types";
import { generateCollabToken } from "@/lib/getCollabToken";
import { useCollabStore } from "@/store/use-collab-store";

export function useCollaboration(document: Document) {
  const router = useRouter();
  const {
    socket,
    connect,
    disconnect,
    collabToken,
    setCollabToken,
  } = useCollabStore();

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
      const msg = JSON.parse(e.data);

      if (msg.type === "collab-approved") {
        console.log("Collaboration approved for doc:", msg.docId);
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
          toast.error("Authentication failed");
          router.push("/");
          break;
        }
      }
    };

    socket.addEventListener("message", onMessage);
    return () => socket.removeEventListener("message", onMessage);
  }, [socket]);

  useEffect(() => () => disconnect(), []);
}
