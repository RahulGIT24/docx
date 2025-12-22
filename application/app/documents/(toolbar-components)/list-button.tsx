'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import { ListIcon } from "lucide-react";

export const ListButton = () => {
  const editor = useAppStore(s=>s.editor);

  const lists = [
    {
      label: "Bullet list",
      icon: ListIcon,
      isActive: () => editor?.isActive("bulletList"),
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered list",
      icon: ListIcon,
      isActive: () => editor?.isActive("orderedList"),
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
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
          <ListIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1 bg-white z-index">
        {lists.map(({ label, onClick, isActive, icon: Icon }) => (
          <button
            key={label}
            className={cn(
              "flex justify-between items-center gap-x-2.5 hover:bg-neutral-300",
              isActive() == true && "bg-neutral-300"
            )}
            onClick={onClick}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};