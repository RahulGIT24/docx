import { create } from "zustand";
import { type Editor } from "@tiptap/react"
import { Document } from "@/types/types";

interface AppState {
    editor: Editor | null;
    setEditor: (editor: Editor | null) => void,
    document: Document | null,
    setDocument: (document: Document | null) => void
    allDocuments: [] | Document[],
    docLoader: boolean,
    setDocLoader: (a: boolean) => void,
    setAllDocuments: (document: Document[] | []) => void}

export const useAppStore = create<AppState>((set) => ({
    editor: null,
    setEditor: (editor) => set({ editor }),
    document: null,
    setDocument: (document) => set({ document }),
    allDocuments: [],
    docLoader: true,
    setDocLoader: (docLoader) => set({ docLoader }),
    setAllDocuments: (allDocuments) => set({ allDocuments }),
}))