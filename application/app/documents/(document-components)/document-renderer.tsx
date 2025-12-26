"use client";
import { SkeletonEditor } from "@/components/skeleton-component";
import { useAppStore } from "@/store/use-app-store";
import { DocumentRendererProps } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "../[documentid]/navbar";
import ToolBar from "../[documentid]/toolbar";
import Editor from "../[documentid]/editor";
import { Lock } from "lucide-react";
import { useCollabStore } from "@/store/use-collab-store";
import { generateCollabToken, getCollabToken } from "@/lib/getCollabToken";

const DocumentRenderer = ({ collab_token, doc_id }: DocumentRendererProps) => {
  const router = useRouter();
  const connect = useCollabStore((s) => s.connect);
  const [loading, setLoading] = useState(true);
  const collabToken = useCollabStore((s) => s.collabToken);
  const setCollabToken = useCollabStore((s) => s.setCollabToken);
  const { setDocument, document } = useAppStore();

  const socket = useCollabStore((s) => s.socket);

  const getDocument = async () => {
    if (!doc_id) return;
    try {
      setLoading(true);
      const res = await axios.get(`/api/doc/${doc_id}`, {
        withCredentials: true,
      });
      const data = {
        ...res.data.data,
        sharingUrl: res.data.data.sharingToken
          ? process.env.NEXT_PUBLIC_BASE_URL +
            "/documents?token=" +
            res.data.data.sharingToken
          : null,
      };
      setDocument(data);
    } catch (error) {
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  const getDocumentByToken = async () => {
    if (!collab_token) return;
    try {
      setLoading(true);
      const res = await axios.get(`/api/doc/collab?token=${collab_token}`, {
        withCredentials: true,
      });
      setDocument(res.data.data);
    } catch (error) {
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!collab_token && !doc_id) {
      router.replace("/");
      return;
    }
    if (doc_id) {
      getDocument();
    }
    if (collab_token) {
      getDocumentByToken();
    }
  }, [collab_token, doc_id]);

  useEffect(() => {
    if (!document) return;
    if (document?.editAccess && collabToken) {
      connect(collabToken as string);
    }
    // if(document?.editAccess && !collabToken){
    //   const token =  generateCollabToken().then()
    //   setCollabToken(token.then(d=>d));
    //   connect(collabToken as string);
    // }
  }, [document,collabToken]);

  useEffect(() => {
    if (!socket) return;
    if (!document) return;
    if (!document.editAccess) return;

    if (socket.readyState !== WebSocket.OPEN) {
      socket.addEventListener(
        "open",
        () => {
          socket.send(
            JSON.stringify({
              type: "collab",
              data: document.sharingToken,
            })
          );
        },
        { once: true }
      );

      return;
    }

    socket.send(
      JSON.stringify({
        type: "collab",
        data: document.sharingToken,
      })
    );
  }, [socket, document]);

  useEffect(() => {
    (async () => {
      const res = await getCollabToken();
      setCollabToken(res);
    })();
  }, []);

  return (
    <>
      {loading && !document ? (
        <SkeletonEditor />
      ) : (
        <>
          <div className="flex flex-col px-4 pt-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden select-none">
            {document && (
              <>
                <Navbar />
                {!doc_id && collab_token && document.editAccess === true && (
                  <ToolBar />
                )}
                {!doc_id && collab_token && document.editAccess === false && (
                  <div className="w-full flex items-center space-x-2 justify-center">
                    <Lock />{" "}
                    <p>
                      Document can't be edited. Ask the creator to enable
                      editing for this document.
                    </p>
                  </div>
                )}
                {doc_id && <ToolBar />}
              </>
            )}
          </div>
          <div className="pt-[114px] print:pt-0 ">{document && <Editor />}</div>
        </>
      )}
    </>
  );
};

export default DocumentRenderer;
