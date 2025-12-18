import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[300px] w-[250px] bg-gray-300" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-gray-300" />
        <Skeleton className="h-4 w-[200px] bg-gray-300" />
      </div>
    </div>
  );
}

export function SkeletonEditor() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[100px] w-screen bg-gray-300" />
      <Skeleton className="h-10 w-screen bg-gray-300" />
      <div className="flex justify-center items-center">
        <Skeleton className="h-[83vh] w-[46vw] bg-gray-300" />
      </div>
    </div>
  );
}
