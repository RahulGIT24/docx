"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { PredefinedTemplatesT } from "@/types/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { SkeletonCard } from "@/components/skeleton-component";
import { useRouter } from "next/navigation";

const TemplateGallery = () => {
  const [templates, setTemplates] = useState<PredefinedTemplatesT[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const createProject = async(templateId:number)=>{
    try {
      const res = await axios.post("/api/doc",{
        id:templateId
      },{withCredentials:true})
      
      const created_document_id = res.data.data;
      routeTo(created_document_id);
    } catch (error) {
      console.log(error);
    }
  }

  const getTemplates = async () => {
    try {
      setLoading(true);
      const templates = await axios.get("/api/template", {
        withCredentials: true,
      });
      setTemplates(templates.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTemplates();
  }, []);

  const routeTo = (id:string)=>{
    router.push("/documents/"+id)
  }

  const isCreating = false;
  return (
    <div className="bg-[#F1F3F4]">
      <div className="max-w-screen mx-auto px-16 py-6 flex flex-col gap-y-4">
        <h1 className="font-medium">Start a new document</h1>
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
            {templates.length > 0 &&
              !loading &&
              templates.map((temp, _) => (
                <CarouselItem
                  key={temp.id}
                  onClick={()=>createProject(temp.id as number)}
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
                        backgroundImage: `url(${temp.preview})`,
                        backgroundSize: `cover`,
                        backgroundPosition: `center`,
                        backgroundRepeat: "no-repeat",
                      }}
                      className="size-full hover:border-blue-500 rounded-sm border hover:bg-blue-50 flex flex-col items-center justify-center gap-y-4 bg-white"
                    ></button>
                    <p className="text-center text-sm font-medium truncate">
                      {temp.name}
                    </p>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default TemplateGallery;
