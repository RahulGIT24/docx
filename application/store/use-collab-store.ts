import { create } from "zustand";
import * as Y from 'yjs';

type CollabState = {
  socket: WebSocket | null;
  collabToken: string | null;
  yDoc: Y.Doc | null
  connect: (token: string) => void;
  disconnect: () => void;
  setCollabToken: (token: string | null) => void;
  setYDoc: (yDoc: Y.Doc) => void
};

export const useCollabStore = create<CollabState>((set, get) => ({
  socket: null,
  collabToken: null,
  yDoc: null,

  setCollabToken: (collabToken) => set({ collabToken }),

  setYDoc: (yDoc) => set({ yDoc }),

  connect: (token) => {
    if (get().socket) return;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`
    );
    ws.binaryType = 'arraybuffer'

    set({ socket: ws });
  },

  disconnect: () => {
    get().socket?.close();
    set({ socket: null });
    set({ yDoc: null })
  },
}));
