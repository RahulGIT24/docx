"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "./editor";
import { Navbar } from "./navbar";
import ToolBar from "./toolbar";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { SkeletonEditor } from "@/components/skeleton-component";
import { Document } from "@/types/types";
import { setDocumentInRedis } from "@/lib/document";

interface DocumentIdPageProps {
  params: {
    documentid: string;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const router = useRouter();
  const { documentid } = useParams<{ documentid: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  const getDocument = async () => {
    if (!documentid) return;
    try {
      setLoading(true);
      const res = await axios.get(`/api/doc/${documentid}`, {
        withCredentials: true,
      });
      setDocument(res.data.data);
    } catch (error) {
      console.log(error);
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentJSON = async (json: string) => {
    try {
      // updateRef.current = true;
      await axios.patch(
        "/api/doc/" + documentid,
        {
          json,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    } finally {
      // updateRef.current = false;
    }
  };

  useEffect(() => {
    getDocument();
  }, [documentid]);

  return (
    <div className="min-h-screen bg-[#FAF8FD]">
      {loading && !document ? (
        <SkeletonEditor />
      ) : (
        <>
          <div className="flex flex-col px-4 pt-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden select-none">
            {document && (
              <>
                <Navbar doc_name={document.name} doc_id={document.id} />
                <ToolBar />
              </>
            )}
          </div>
          <div className="pt-[114px] print:pt-0 ">
            {document && (
              <Editor saveToDB={updateDocumentJSON} document={document} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentIdPage;
