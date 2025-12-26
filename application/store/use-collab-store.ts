import { create } from "zustand";

type CollabState = {
    socket: WebSocket | null;
    roomId: string | null;
    connect: (url: string) => void;
    disconnect: () => void;
    collabToken: string | null
    setCollabToken: (token: string | null) => void
};

export const useCollabStore = create<CollabState>((set, get) => ({
    socket: null,
    roomId: null,
    collabToken: null,

    setCollabToken: (collabToken) => set({ collabToken }),

    connect: (token:string) => {
        if (get().socket) return;
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`);
        set({ socket: ws });
    },

    disconnect: () => {
        get().socket?.close();
        set({ socket: null, roomId: null });
    },
}));