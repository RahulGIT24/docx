'use client';

import { useAppStore } from "@/store/use-app-store";
import { DocumentRendererProps } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useDocument({ doc_id, collab_token }:DocumentRendererProps) {
  const router = useRouter();
  const { document, setDocument } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doc_id && !collab_token) {
      router.replace("/");
      return;
    }

    const fetch = async () => {
      try {
        setLoading(true);
        const url = doc_id
          ? `/api/doc/${doc_id}`
          : `/api/doc/collab?token=${collab_token}`;

        const res = await axios.get(url, { withCredentials: true });
        setDocument(res.data.data);
      } catch {
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [doc_id, collab_token]);

  return { document, loading };
}
