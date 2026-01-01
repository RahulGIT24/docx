import { create } from "zustand";

type CollabState = {
  socket: WebSocket | null;
  collabToken: string | null;
  connect: (token: string) => void;
  disconnect: () => void;
  setCollabToken: (token: string | null) => void;
};

export const useCollabStore = create<CollabState>((set, get) => ({
  socket: null,
  collabToken: null,

  setCollabToken: (collabToken) => set({ collabToken }),

  connect: (token) => {
    if (get().socket) return;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`
    );

    set({ socket: ws });
  },

  disconnect: () => {
    get().socket?.close();
    set({ socket: null });
  },
}));
