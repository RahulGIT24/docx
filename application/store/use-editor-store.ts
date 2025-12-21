import { create } from "zustand";
import { type Editor } from "@tiptap/react"
import { Document } from "@/types/types";

interface EditorState {
    editor: Editor | null;
    setEditor: (editor: Editor | null) => void,
    document: Document | null,
    setDocument: (document: Document | null) => void
}

export const useEditorStore = create<EditorState>((set) => ({
    editor: null,
    setEditor: (editor) => set({ editor }),
    document: null,
    setDocument: (document) => set({ document })
}))