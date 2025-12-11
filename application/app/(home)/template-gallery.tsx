"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const templates = [
  { id: "blank", label: "Blank Document", imageUrl: "./blank-document.svg",JSON:"" },
  { id: "for_party", label: "Party Invitation", imageUrl: "./party_invite.png",JSON:"" },
  { id: "for_bug", label: "Bug Report", imageUrl: "./bug_report.png",JSON:"" },
  { id: "project_proposal", label: "Project Proposal", imageUrl: "./project_proposal.png",JSON:"" },
];

const TemplateGallery = () => {
  const isCreating = false;
  return (
    <div className="bg-[#F1F3F4]">
      <div className="max-w-screen mx-auto px-16 py-6 flex flex-col gap-y-4">
        <h1 className="font-medium">Start a new document</h1>
        <Carousel>
          <CarouselContent className="-ml-4">
            {templates.map((temp, _) => (
              <CarouselItem
                key={temp.id}
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
                      backgroundImage: `url(${temp.imageUrl})`,
                      backgroundSize: `cover`,
                      backgroundPosition: `center`,
                      backgroundRepeat: "no-repeat",
                    }}
                    className="size-full hover:border-blue-500 rounded-sm border hover:bg-blue-50 flex flex-col items-center justify-center gap-y-4 bg-white"
                  ></button>
                  <p className="text-center text-sm font-medium truncate">{temp.label}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious/>
          <CarouselNext/>
        </Carousel>
      </div>
    </div>
  );
};

export default TemplateGallery;
