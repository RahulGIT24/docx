"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { DocumentRenderer } from "./(document-components)/document-renderer";

const CollabDocument = () => {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!params.get("token")) {
      router.replace("/");
    }
  }, [params]);

  return (
    <div className="min-h-screen bg-[#FAF8FD]">
      <DocumentRenderer collab_token={params.get("token") as string} />
    </div>
  );
};

export default CollabDocument;
