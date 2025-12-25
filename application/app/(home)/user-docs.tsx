"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Trash2Icon } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { getCollabToken } from "@/lib/getCollabToken";

const UserDocs = () => {
  const docs = useAppStore((s) => s.allDocuments);
  const setDocs = useAppStore((s) => s.setAllDocuments);
  const loading = useAppStore((s) => s.docLoader);
  const setLoading = useAppStore((s) => s.setDocLoader);
  const setCollabToken = useAppStore((s)=>s.setUserCollabToken);

  const searchParams = useSearchParams();
  const searchVal = searchParams.get("search");

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const router = useRouter();

  const getUserDocs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/doc?limit=${limit}&page=${page}`, {
        withCredentials: true,
      });
      setTotalPages(Math.ceil(res.data.count / limit));
      setDocs(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentid: number) => {
    if (!documentid) return;
    try {
      setLoading(true);
      await axios.delete(`/api/doc/${documentid}`, {
        withCredentials: true,
      });
      getUserDocs();
    } catch (error) {
      console.log(error);
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchVal) {
      setTotalPages(0);
      return;
    }
    getUserDocs();
  }, [page, searchVal]);
  

  useEffect(()=>{
    (async()=>{
      const res = await getCollabToken();
      setCollabToken(res);
    })()
  },[])

  return !loading && docs.length === 0 ? (
    <div className="min-h-full">
      <div className="max-w-screen mx-auto px-16 py-6 flex flex-col gap-y-4">
        <h1 className="font-medium mb-4">Your Documents</h1>
        <p className="text-2xl text-center font-bold">
          You have no documents. Use templates to create your first
          document..................
        </p>
      </div>
    </div>
  ) : (
    <div className="min-h-full">
      <div className="max-w-screen mx-auto px-16 py-6 flex flex-col gap-y-4">
        {docs.length > 0 && (
          <h1 className="font-medium mb-4">Your Documents</h1>
        )}

        {/* Scrollable container */}
        <div className="bg-white border rounded-lg overflow-y-auto max-h-1/4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Last modified</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Loading skeleton */}
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={3}>
                      <div className="h-4 w-[60%] bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))}

              {/* Documents */}
              {!loading &&
                docs.map((doc) => (
                  <TableRow
                    key={doc.id}
                    onClick={() => router.push(`/documents/${doc.id}`)}
                    className="cursor-pointer hover:bg-muted"
                  >
                    <TableCell className="flex items-center gap-3 max-w-[400px]">
                      <img
                        src="/doc.png"
                        alt="doc"
                        className="h-6 w-6 shrink-0"
                      />
                      <span className="truncate text-lg font-semibold">
                        {doc.name}
                      </span>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(doc.updatedAt).toDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(doc.createdAt).toDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc.id);
                        }}
                      >
                        <Trash2Icon color="red" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="bottom-5  fixed overflow-hidden select-none">
            <PaginationPrevious
              isActive={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="cursor-pointer"
            />
            <PaginationContent>
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => setPage(pageNumber)}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            </PaginationContent>
            <PaginationNext
              isActive={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="cursor-pointer"
            />
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default UserDocs;
