import { EyeIcon, Lock } from "lucide-react";
import { Navbar } from "../[documentid]/navbar";
import ToolBar from "../[documentid]/toolbar";
import Editor from "../[documentid]/editor";
import { useCollaboration } from "@/hooks/use-collab";
import { SkeletonEditor } from "@/components/skeleton-component";
import { Document, DocumentRendererProps } from "@/types/types";
import { useDocument } from "@/hooks/use-document";
import { useCollabStore } from "@/store/use-collab-store";

export const DocumentRenderer = ({
  doc_id,
  collab_token,
}: DocumentRendererProps) => {
  const { document, loading } = useDocument({ doc_id, collab_token });

  useCollaboration(document as Document);

  const { yDoc } = useCollabStore();

  if (loading) return <SkeletonEditor />;
  if (!document) return null;
  if (!yDoc && document.editAccess === true) return <SkeletonEditor />;

  return (
    <>
      <Navbar />
      {document.editAccess || !collab_token ? (
        <ToolBar />
      ) : (
        <div className="flex justify-center items-center gap-x-2">
          <p>View Only Mode</p>
          <EyeIcon />
        </div>
      )}
      <Editor />
    </>
  );
};
