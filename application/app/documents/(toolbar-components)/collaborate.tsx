"use client";

import { cn } from "@/lib/utils";
import { SlPeople } from "react-icons/sl";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/store/use-app-store";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useCollabStore } from "@/store/use-collab-store";

const Collaborate = () => {
  const [dialogState, setDialogState] = useState(false);
  const [docSharing, setDocSharing] = useState(false);
  const [editAccess, setEditAccess] = useState(false);
  const { disconnect } = useCollabStore();
  const [editAccLoader, seteditAccLoader] = useState(false);

  const doc = useAppStore((s) => s.document);
  const setDoc = useAppStore((s) => s.setDocument);

  useEffect(() => {
    if (!doc) return;
    setDocSharing(!!doc.isShared);
    setEditAccess(!!doc.editAccess);
  }, [doc]);

  const onChangeDocSharing = async (state: boolean) => {
    if (!doc) return;

    seteditAccLoader(true);
    const prev = docSharing;
    setDocSharing(state);

    if(!state){
      setEditAccess(false)
    }

    try {
      const res = await axios.patch(
        `/api/doc/${doc.id}`,
        { isShared: state },
        { withCredentials: true }
      );

      setDoc({
        ...doc,
        isShared: state,
        editAccess:res.data.data.editAccess,
        sharingToken: res.data.data.sharingToken,
      });

      if (state) {
        toast.success("Document is sharing now");
      } else {
        toast.success("Document sharing disabled");
      }
    } catch (err) {
      setDocSharing(prev);
    } finally {
      seteditAccLoader(false);
    }
  };

  const onChangeEditAccess = async (state: boolean) => {
    if (!doc) return;

    const prev = editAccess;
    setEditAccess(state);

    try {
      await axios.patch(
        `/api/doc/${doc.id}`,
        { editAccess: state },
        { withCredentials: true }
      );

      setDoc({
        ...doc,
        editAccess: state,
      });

      toast.success("Editing Status Updated");

      if (!state) {
        disconnect();
      }
    } catch (err) {
      setEditAccess(prev);
    }
  };

  return (
    <>
      <button
        className={cn(
          "h-7 min-w-7 z-20 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-300 px-1.5 text-sm"
        )}
        title="Collaborate"
        onClick={() => setDialogState(true)}
      >
        <SlPeople size={20} />
      </button>

      <Dialog open={dialogState} onOpenChange={setDialogState}>
        <DialogContent>
          <DialogTitle>Collaborate with Docx</DialogTitle>

          <div className="flex items-center space-x-2">
            <Switch
              id="share-doc"
              checked={docSharing}
              onCheckedChange={onChangeDocSharing}
            />
            <Label htmlFor="share-doc">
              {docSharing ? "Document sharing enabled" : "Enable sharing"}
            </Label>
          </div>

          {/* {docSharing && (
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                disabled={editAccLoader}
                id="allow-edit"
                checked={editAccess}
                onCheckedChange={onChangeEditAccess}
              />
              <Label htmlFor="allow-edit">
                {editAccess ? "Editing allowed" : "Allow editing"}
              </Label>
            </div>
          )} */}

          {doc?.sharingToken && (
            <>
              <p className="font-semibold">Sharing URL</p>
              <div className="flex space-x-2 items-center justify-between select-none text-[16px]">
                <p>
                  {(
                    process.env.NEXT_PUBLIC_BASE_URL +
                    "documents?token=" +
                    doc.sharingToken
                  ).slice(0, 47) + "....."}
                </p>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      (process.env.NEXT_PUBLIC_BASE_URL +
                        "documents?token=" +
                        doc.sharingToken) as string
                    );
                    toast.success("Copied to clipboard");
                  }}
                >
                  <Copy />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Collaborate;
