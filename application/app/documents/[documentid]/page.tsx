"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import DocumentRenderer from "../(document-components)/document-renderer";

const DocumentIdPage = () => {
  const { setDocument } = useAppStore();
  const { documentid } = useParams<{ documentid: string }>();

  useEffect(() => {
    return () => setDocument(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8FD]">
      <DocumentRenderer doc_id={Number(documentid)} />
    </div>
  );
};

export default DocumentIdPage;
