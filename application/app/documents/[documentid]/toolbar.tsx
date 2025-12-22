"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import {
  BoldIcon,
  ItalicIcon,
  ListTodoIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SpellCheck2Icon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { FontFamilyButton, FontSizeButton } from "../(toolbar-components)/font";
import { HeadingLevelButton } from "../(toolbar-components)/heading-level";
import { TextColorButton } from "../(toolbar-components)/text-color";
import { HighlightColorButton } from "../(toolbar-components)/highlight-color";
import { LinkButton } from "../(toolbar-components)/link-button";
import { ImageButton } from "../(toolbar-components)/image-button";
import { AlignButton } from "../(toolbar-components)/align-button";
import { LineHeightButton } from "../(toolbar-components)/line-height";
import { ListButton } from "../(toolbar-components)/list-button";
import { AiTextGeneration } from "../(toolbar-components)/ai-textgen";

interface ToolBarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
}

const ToolBarButton = ({
  onClick,
  isActive,
  icon: Icon,
}: ToolBarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
        isActive && "bg-neutral-200/80"
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};

const ToolBar = () => {
  const editor = useAppStore((s) => s.editor);

  const sections: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
  }[][] = [
    [
      {
        label: "Undo",
        icon: Undo2Icon,
        onClick: () => editor?.chain().focus().undo().run(),
      },
      {
        label: "Redo",
        icon: Redo2Icon,
        onClick: () => editor?.chain().focus().redo().run(),
      },
      {
        label: "Print",
        icon: PrinterIcon,
        onClick: () => window.print(),
      },
      {
        label: "Spell Check",
        icon: SpellCheck2Icon,
        onClick: () => {
          const current = editor?.view.dom.getAttribute("spellcheck");
          editor?.view.dom.setAttribute(
            "spellcheck",
            current === "false" ? "true" : "false"
          );
        },
      },
    ],
    [
      {
        label: "Bold",
        icon: BoldIcon,
        isActive: editor?.isActive("bold"),
        onClick: () => editor?.chain().focus().toggleBold().run(),
      },
      {
        label: "Italic",
        icon: ItalicIcon,
        isActive: editor?.isActive("italic"),
        onClick: () => editor?.chain().focus().toggleItalic().run(),
      },
      {
        label: "Underline",
        icon: UnderlineIcon,
        isActive: editor?.isActive("underline"),
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
      },
    ],
    [
      {
        label: "Comment",
        icon: MessageSquarePlusIcon,
        onClick: () => console.log("TODO: Comment Clicked"),
        isActive: false, // enable this functionality
      },
      {
        label: "List Todo",
        icon: ListTodoIcon,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
        isActive: editor?.isActive("taskList"),
      },
      {
        label: "Remove Formatting",
        icon: RemoveFormattingIcon,
        onClick: () => editor?.chain().focus().unsetAllMarks().run(),
      },
    ],
  ];

  return (
    <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-3xl min-h-10 flex items-center">
      {sections[0].map((item, _) => (
        <ToolBarButton key={item.label} {...item} />
      ))}
      |
      <FontFamilyButton />
      <HeadingLevelButton />|
      {sections[1].map((item, _) => (
        <ToolBarButton key={item.label} {...item} />
      ))}
      <FontSizeButton />
      <TextColorButton />
      <HighlightColorButton />
      |
      <LinkButton />
      <ImageButton />
      <AlignButton />
      <LineHeightButton />
      <ListButton />|
      {sections[2].map((item, _) => (
        <ToolBarButton key={item.label} {...item} />
      ))}
      |
      <AiTextGeneration />
    </div>
  );
};

export default ToolBar;
