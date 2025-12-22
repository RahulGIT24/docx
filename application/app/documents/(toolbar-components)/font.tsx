'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import { ChevronDownIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

type Font = {
  label: string;
  value: string;
};

export const FontSizeButton = () => {
  const editor = useAppStore(s=>s.editor);

  const currentFontSize = editor?.getAttributes("textStyle").fontSize
    ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
    : "16";

  const [fontSize, setFontSize] = useState(currentFontSize);
  const [inputValue, setInputValue] = useState(fontSize);
  const [isEditing, setIsEditing] = useState(false);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);

    if (!isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(newSize);
      setInputValue(newSize);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increment = () => {
    const newSize = parseInt(fontSize) + 1;
    updateFontSize(newSize.toString());
  };

  const decrement = () => {
    const newSize = parseInt(fontSize) - 1;
    updateFontSize(newSize.toString());
  };

  return (
    <div className="flex items-center gap-0.5">
      <button
        className={cn(
          "h-7 flex justify-between items-center gap-x-2.5 hover:bg-neutral-300"
        )}
        onClick={decrement}
      >
        <MinusIcon className="size-4" />
      </button>
      {isEditing ? (
        <input
          type="text"
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          value={inputValue}
          className={cn(
            "h-7 w-10 text-sm border boder-neutral-400 outline-none text-center focus-ring-0 cursor-text"
          )}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <button
          className={cn("h-7 w-10 text-sm border boder-neutral-400")}
          onClick={() => setIsEditing(true)}
        >
          {currentFontSize}
        </button>
      )}
      <button
        className={cn(
          "h-7 flex justify-between items-center gap-x-2.5 hover:bg-neutral-300"
        )}
        onClick={increment}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};


export const FontFamilyButton = () => {
  const editor = useAppStore(s=>s.editor);

  const fonts: Font[] = [
    { label: "Arial", value: "Arial" },
    { label: "Helvetica", value: "Helvetica" },
    { label: "Verdana", value: "Verdana" },
    { label: "Tahoma", value: "Tahoma" },
    { label: "Trebuchet MS", value: "Trebuchet MS" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Georgia", value: "Georgia" },
    { label: "Courier New", value: "Courier New" },
    { label: "Courier", value: "Courier, monospace" },
    { label: "Lucida Console", value: '"Lucida Console", Monaco, monospace' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-7 w-[120px] z-20 shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-300 px-1.5 overflow-hidden text-sm"
          )}
        >
          <span className="truncate">
            {editor?.getAttributes("textStyle").fontFamily || "Arial"}
          </span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0"/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {fonts.map((f, _) => (
          <button
            key={_}
            onClick={() => editor?.chain().focus().setFontFamily(f.value).run()}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-300 z-50",
              editor?.getAttributes("textStyle").fontFamily === f.value &&
                "bg-neutral-200/80"
            )}
            style={{ fontFamily: f.value }}
          >
            <span>{f.label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
