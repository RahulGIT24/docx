import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import axios from "axios";
import { Bot } from "lucide-react";
import { useState } from "react";

export const AiTextGeneration = () => {
  const [query, setQuery] = useState("");
  const [dialogState, setDialogState] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const editor = useAppStore(s=>s.editor);

  const writingFn = async () => {
    if (!query) return;
    try {
      setQuery("");
      setDisabled(true);
      const res = await axios.post(
        "/api/generate-content",
        { query },
        { withCredentials: true }
      );
      const renderableJSON = JSON.parse(res.data.data);
      const endPosition = editor?.state.doc.content.size;
      if (endPosition) {
        editor?.chain().insertContentAt(endPosition, renderableJSON).run();
      }
      setDialogState(false);
    } catch (error) {
      console.log(error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <>
      <button
        className={cn(
          "h-7 min-w-7 z-20 shrink-0 flex items-center flex-col justify-center rounded-sm hover:bg-neutral-300 px-1.5 overflow-hidden text-sm cursor-pointer"
        )}
        title="Bot Assistance"
        onClick={() => setDialogState(true)}
      >
        <Bot />
      </button>
      <Dialog
        open={dialogState}
        onOpenChange={() => setDialogState(!dialogState)}
      >
        <DialogContent title="d-content">
          <DialogTitle>AI Bot Assistance for writing</DialogTitle>
          <Textarea
            placeholder="What you want to write today?"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className="h-[12vh]"
          />
          <Button disabled={query === "" || disabled} onClick={writingFn}>
            Generate <Bot/>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};