'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import { ListCollapseIcon } from "lucide-react";

export const LineHeightButton = () => {
  const editor = useAppStore((s) => s.editor);

  const lineheights = [
    {
      label: "Default",
      value: "normal",
    },
    {
      label: "Single",
      value: "1",
    },
    {
      label: "1.15",
      value: "1.15",
    },
    {
      label: "1.5",
      value: "1.5",
    },
    {
      label: "Double",
      value: "2",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 min-w-7 shrink-0 flex items-center flex-col justify-center rounded-sm hover:bg-neutral-300 px-1.5 overflow-hidden text-sm"
          )}
        >
          <ListCollapseIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1 bg-white z-index">
        {lineheights.map(({ label, value }) => (
          <button
            key={value}
            className={cn(
              "flex justify-between items-center gap-x-2.5 hover:bg-neutral-300",
              editor?.getAttributes("paragraph").lineHeight == value &&
                "bg-neutral-300"
            )}
            onClick={() => editor?.chain().focus().setLineHeight(value).run()}
          >
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
