'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import { HighlighterIcon } from "lucide-react";
import { ColorResult, SketchPicker } from "react-color";

export const HighlightColorButton = () => {
  const editor = useAppStore(s=>s.editor);

  const value = editor?.getAttributes("highlight").color || "#FFFFFF";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 shrink-0 flex items-center flex-col justify-center rounded-sm hover:bg-neutral-300 px-1.5 overflow-hidden text-sm"
          )}
        >
          <HighlighterIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border">
        <SketchPicker color={value} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
