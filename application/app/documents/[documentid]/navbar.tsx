"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { DocumentInput } from "./document-input";
import {
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  GlobeIcon,
  ItalicIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormatting,
  Strikethrough,
  TextIcon,
  TrashIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { BsFilePdf, BsFileText } from "react-icons/bs";
import { useAppStore } from "@/store/use-app-store";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

interface tableConfig {
  rows: number;
  cols: number;
}

const NavComponents = () => {
  const editor = useAppStore((s) => s.editor);
  const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
    editor?.chain().focus().insertTable({ rows, cols }).run();
  };
  const onDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  };
  const tableConfig: tableConfig[] = useMemo(() => {
    return [
      {
        rows: 1,
        cols: 1,
      },
      {
        rows: 2,
        cols: 2,
      },
      {
        rows: 3,
        cols: 3,
      },
      {
        rows: 4,
        cols: 4,
      },
      {
        rows: 5,
        cols: 5,
      },
      {
        rows: 6,
        cols: 6,
      },
    ];
  }, []);
  const onSaveJSON = () => {
    if (!editor) return;
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], {
      type: "application/json",
    });
    onDownload(blob, `Document.json`);
  };
  const onSaveHTML = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], {
      type: "text/html",
    });
    onDownload(blob, `Document.html`);
  };
  const onSaveText = () => {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], {
      type: "text/plain",
    });
    onDownload(blob, `Document.txt`);
  };
  return (
    <div className="flex">
      <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
        <MenubarMenu>
          <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
            File
          </MenubarTrigger>
          <MenubarContent className="print:hidden">
            <MenubarSub>
              <MenubarSubTrigger>
                <FileIcon className="size-4 mr-2" />
                Save
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onClick={onSaveJSON}>
                  <FileJsonIcon className="size-4 mr-2" />
                  JSON
                </MenubarItem>
                <MenubarItem onClick={onSaveHTML}>
                  <GlobeIcon className="size-4 mr-2" />
                  HTML
                </MenubarItem>
                <MenubarItem onClick={() => window.print()}>
                  <BsFilePdf className="size-4 mr-2" />
                  PDF
                </MenubarItem>
                <MenubarItem onClick={onSaveText}>
                  <BsFileText className="size-4 mr-2" />
                  Text
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem>
              <FilePlusIcon className="size-4 mr-2" />
              New Document
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <FilePenIcon className="size-4 mr-2" />
              Rename
            </MenubarItem>
            <MenubarItem>
              <TrashIcon className="size-4 mr-2" />
              Remove
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => window.print()}>
              <PrinterIcon className="size-4 mr-2" />
              Print <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
            Edit
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
              <Undo2Icon className="size-4 mr-2" />
              Undo<MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
              <Redo2Icon className="size-4 mr-2" />
              Redo <MenubarShortcut>⌘Y</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
            Insert
          </MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Table</MenubarSubTrigger>
              <MenubarSubContent>
                {tableConfig.map(({ rows, cols }) => (
                  <MenubarItem
                    onClick={() => {
                      insertTable({ rows, cols });
                    }}
                    key={rows}
                  >
                    {rows} X {cols}
                  </MenubarItem>
                ))}
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
            Format
          </MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>
                <TextIcon className="size-4 mr-2" />
                Text
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                >
                  <BoldIcon className="size-4 mr-2" />
                  Bold
                </MenubarItem>
                <MenubarItem
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                >
                  <ItalicIcon className="size-4 mr-2" />
                  Italics
                </MenubarItem>
                <MenubarItem
                  onClick={() =>
                    editor?.chain().focus().toggleUnderline().run()
                  }
                >
                  <UnderlineIcon className="size-4 mr-2" />
                  Underline
                </MenubarItem>
                <MenubarItem
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                >
                  <Strikethrough className="size-4 mr-2" />
                  Strikethrough
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem>
              <RemoveFormatting className="size-4 mr-2" />
              Clear Formatting
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export const Navbar = () => {
  const params = useSearchParams();

  const current_doc = useAppStore((s) => s.document);

  return (
    <nav className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Link href={"/"}>
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
        </Link>
        <div className="flex flex-col pb-2">
          {!params.get("token") && <DocumentInput />}
          {params.get("token") && current_doc && <p>{current_doc.name}</p>}
          {!params.get("token") && <NavComponents />}
          {params.get("token") &&
            current_doc?.sharingToken === params.get("token") &&
            current_doc?.editAccess == false && <></>}
          {params.get("token") &&
            current_doc?.sharingToken === params.get("token") &&
            current_doc?.editAccess == true && <NavComponents />}
        </div>
      </div>
    </nav>
  );
};
