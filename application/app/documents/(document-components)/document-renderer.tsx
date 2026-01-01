import { Lock } from "lucide-react";
import { Navbar } from "../[documentid]/navbar";
import ToolBar from "../[documentid]/toolbar";
import Editor from "../[documentid]/editor";
import { useCollaboration } from "@/hooks/use-collab";
import { SkeletonEditor } from "@/components/skeleton-component";
import { Document, DocumentRendererProps } from "@/types/types";
import { useDocument } from "@/hooks/use-document";

export const DocumentRenderer = ({ doc_id, collab_token }:DocumentRendererProps) => {
  const { document, loading } = useDocument({ doc_id, collab_token });

  useCollaboration(document as Document);

  if (loading) return <SkeletonEditor />;

  if (!document) return null;

  return (
    <>
      <Navbar />
      {document.editAccess ? <ToolBar /> : <Lock />}
      <Editor />
    </>
  );
};
