'use client';

import { useEditor, EditorContent, Editor as EditorT, Extension } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import { TextStyle, Color, FontFamily } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import { Collaboration } from "@tiptap/extension-collaboration";

import { useAppStore } from "@/store/use-app-store";
import { useCollabStore } from "@/store/use-collab-store";

import { Ruler } from "./ruler";

import { useMemo, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import axios from "axios";

// import { Extension } from "@tiptap/core";

// === ParagraphIndent extension ===
export const ParagraphIndent = Extension.create({
  name: "paragraphIndent",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          indent: {
            default: 0,
            renderHTML: attrs => {
              if (!attrs.indent) return {};
              return {
                style: `margin-left: ${attrs.indent}px`,
              };
            },
          },
        },
      },
    ];
  },
});

const INITIAL_EXTENSIONS = [
  StarterKit,
  LineHeightExtension,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TextStyle,
  Color,
  FontSizeExtension,
  FontFamily,
  Highlight.configure({ multicolor: true }),
  Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
  TaskList,
  TaskItem.configure({ nested: true }),
  TableKit.configure({ table: { resizable: true } }),
  Image,
  ImageResize,
  ParagraphIndent, // <- added
];

const DEFAULT_LEFT = 50;
const DEFAULT_RIGHT = 50;
const RULER_WIDTH = 816;
const MIN_GAP = 100;

const Editor = () => {
  const setEditor = useAppStore(s => s.setEditor);
  const document = useAppStore(s => s.document);
  const yDoc = useCollabStore(s => s.yDoc);

  const debounceRef = useRef<any>(null);

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
  }, [yDoc]);

  const editor = useEditor({
    extensions,
    content: yDoc ? null : document?.json ? JSON.parse(document.json) : "",
    editorProps: {
      attributes: {
        style: `padding-left: ${DEFAULT_LEFT}px; padding-right: ${DEFAULT_RIGHT}px`,
        class: "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      if (debounceRef.current) debounceRef.current(editor);
    },
  });

  const saveToDB = async (json: string) => {
    if (!document) return;
    try {
      await axios.patch(`/api/doc/${document.id}`, { json }, { withCredentials: true });
    } catch (err) {
      console.log(err);
    }
  };

  // Debounce saving
  useEffect(() => {
    if (!debounceRef.current) {
      debounceRef.current = debounce((editor: EditorT) => {
        saveToDB(JSON.stringify(editor.getJSON()));
      }, 1000);
    }
    return () => debounceRef.current?.cancel();
  }, [editor]);

  // === Ruler state ===
  const [leftMargin, setLeftMargin] = useAppStore(s => [s.leftMargin, s.setLeftMargin]);
  const [rightMargin, setRightMargin] = useAppStore(s => [s.rightMargin, s.setRightMargin]);

  // Apply indent when ruler changes
  useEffect(() => {
    if (!editor) return;
    editor.chain().focus().updateAttributes("paragraph", { indent: leftMargin }).run();
  }, [leftMargin, editor]);

  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
      <Ruler
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        onLeftChange={setLeftMargin}
        onRightChange={setRightMargin}
      />
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
