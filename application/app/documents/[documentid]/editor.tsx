"use client";

import { useEditor, EditorContent, Editor as EditorT } from "@tiptap/react";
import { TaskList } from "@tiptap/extension-list";
import debounce from "lodash.debounce";
import { TaskItem } from "@tiptap/extension-list";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import { FontFamily, TextStyle, Color } from "@tiptap/extension-text-style";
import { useEditorStore } from "@/store/use-editor-store";
import { Highlight } from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

// Custom Extension
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import { Ruler } from "./ruler";
import { useEffect } from "react";
import { useRef } from "react";
import axios from "axios";

const Editor = () => {
  const { setEditor, document } = useEditorStore();
  const saveToDB = async (json: string) => {
    if (!document) return;
    try {
      // updateRef.current = true;
      await axios.patch(
        "/api/doc/" + document.id,
        {
          json,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    } finally {
      // updateRef.current = false;
    }
  };

  const debounceRef = useRef<
    | (((editor: EditorT) => void) & { cancel: () => void; flush: () => void })
    | null
  >(null);

  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);
      // console.log(editor.getJSON())
      debounceRef.current!(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    extensions: [
      StarterKit,
      LineHeightExtension,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      FontSizeExtension,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      FontFamily,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TableKit.configure({
        table: { resizable: true },
      }),
      Image,
      ImageResize,
    ],
    immediatelyRender: false,
    content: document?.json ? JSON.parse(document?.json) : "",
    editorProps: {
      attributes: {
        style: "padding-left: 56px; padding-right: 56px",
        class:
          "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
  });

  useEffect(() => {
    if (!debounceRef.current) {
      debounceRef.current = debounce((editor: EditorT) => {
        const json = JSON.stringify(editor.getJSON());
        saveToDB(json);
      }, 1000);
    }
    return () => {
      debounceRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      debounceRef.current?.flush();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
      <Ruler />
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
