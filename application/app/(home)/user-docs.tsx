"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { SkeletonCard } from "@/components/skeleton-component";
import { useRouter } from "next/navigation";
import { Document } from "@/types/types";

const UserDocs = () => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getUserDocs = async () => {
    try {
      setLoading(true);
      const templates = await axios.get("/api/doc", {
        withCredentials: true,
      });
      setDocs(templates.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDocs();
  }, []);

  const isCreating = false;
  return (
    <div className="bg-[#F1F3F4]">
      <div className="max-w-screen mx-auto px-16 py-6 flex flex-col gap-y-4">
        {docs && docs.length > 0 && (
          <h1 className="font-medium">Your Recent Documents</h1>
        )}
        <Carousel>
          <CarouselContent className="-ml-4">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%]"
                >
                  <SkeletonCard />
                </CarouselItem>
              ))}
            {docs.length > 0 &&
              !loading &&
              docs.map((doc, _) => (
                <CarouselItem
                  key={doc.id}
                  onClick={() => router.push(`/documents/${doc.id}`)}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%]"
                >
                  <div
                    className={cn(
                      "aspect-3/4 flex flex-col gap-y-2.5",
                      isCreating && "pointer-events-none opacity-50"
                    )}
                  >
                    <button
                      disabled={isCreating}
                      onClick={() => console.log("Clicked")}
                      style={{
                        backgroundImage: `url('/doc.png')`,
                        backgroundSize: `cover`,
                        backgroundPosition: `center`,
                        backgroundRepeat: "no-repeat",
                        padding: "",
                      }}
                      className=" size-full bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-y-4 cursor-pointer shadow-s transition-al duration-20 ease-out hover:border-blue-500 hover:bg-blue-50 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]
"
                    ></button>
                    <p className="text-center text-sm font-medium truncate">
                      {doc.name}
                    </p>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          {docs && docs.length > 0 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default UserDocs;
