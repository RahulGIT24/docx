"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "./editor";
import { Navbar } from "./navbar";
import ToolBar from "./toolbar";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { SkeletonEditor } from "@/components/skeleton-component";
import { useEditorStore } from "@/store/use-editor-store";

const DocumentIdPage = () => {
  const router = useRouter();
  const { documentid } = useParams<{ documentid: string }>();
  const [loading, setLoading] = useState(true);

  const { setDocument, document } = useEditorStore();

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

  useEffect(() => {
    getDocument();
  }, [documentid]);

  useEffect(() => {
    return () => setDocument(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8FD]">
      {loading && !document ? (
        <SkeletonEditor />
      ) : (
        <>
          <div className="flex flex-col px-4 pt-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden select-none">
            {document && (
              <>
                <Navbar />
                <ToolBar />
              </>
            )}
          </div>
          <div className="pt-[114px] print:pt-0 ">{document && <Editor />}</div>
        </>
      )}
    </div>
  );
};

export default DocumentIdPage;
