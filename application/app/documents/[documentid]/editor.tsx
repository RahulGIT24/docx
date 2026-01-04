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
import { useAppStore } from "@/store/use-app-store";
import { Highlight } from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import { Ruler } from "./ruler";
import { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { Collaboration } from "@tiptap/extension-collaboration";
import { useSearchParams } from "next/navigation";
import { useCollabStore } from "@/store/use-collab-store";

const INITIAL_EXTENSIONS = [
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
];
const Editor = () => {
  const setEditor = useAppStore((s) => s.setEditor);
  const document = useAppStore((s) => s.document);
  const yDoc = useCollabStore((s) => s.yDoc);

  const extensions = useMemo(() => {
    const base = [...INITIAL_EXTENSIONS];

    if (yDoc) {
      base.push(
        Collaboration.configure({
          document: yDoc,
          field: "content",
        })
      );
    }

    return base;
  }, [!!yDoc]);

  const saveToDB = async (json: string) => {
    if (!document) return;
    try {
      await axios.patch(
        "/api/doc/" + document.id,
        {
          json,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const debounceRef = useRef<
    | (((editor: EditorT) => void) & { cancel: () => void; flush: () => void })
    | null
  >(null);

  const params = useSearchParams();

  const editor = useEditor(
    {
      editable:
        params.get("token") &&
        document &&
        document.sharingToken === params.get("token")
          ? document.editAccess
          : true,
      onCreate({ editor }) {
        setEditor(editor);
      },
      onDestroy() {
        setEditor(null);
      },
      onUpdate({ editor }) {
        setEditor(editor);
        if (debounceRef?.current) {
          debounceRef.current!(editor);
        }
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
      extensions: extensions,
      immediatelyRender: false,
      content: document?.json && !document.sharingToken ? JSON.parse(document?.json) : null,
      editorProps: {
        attributes: {
          style: "padding-left: 56px; padding-right: 56px",
          class:
            "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
        },
      },
    },
    [yDoc]
  );

  useEffect(() => {
    if (yDoc) {
      debounceRef.current = null;
      return;
    }
    if (!debounceRef.current) {
      debounceRef.current = debounce((editor: EditorT) => {
        const json = JSON.stringify(editor.getJSON());
        saveToDB(json);
      }, 1000);
    }
    return () => {
      debounceRef.current?.cancel();
    };
  }, [yDoc]);

  useEffect(() => {
    if (yDoc) return;
    const interval = setInterval(() => {
      debounceRef.current?.flush();
    }, 5000);

    return () => clearInterval(interval);
  }, [yDoc]);

  useEffect(() => {
    if (!yDoc || !document?.json || !editor) return;
    const meta = yDoc.getMap("meta");

    if (meta.get("seeded")) return;

    yDoc.transact(() => {
      editor.commands.setContent(JSON.parse(document.json));
      meta.set("seeded", true);
    });
  }, [yDoc, editor, document?.json]);

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
