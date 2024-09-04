import { getFiles } from "@/api/files";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader } from "lucide-react";
import { FileResponse } from "@/types";

export default function Files() {
  const { videoId, videoTitle } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["files", currentPage],
    queryFn: () => getFiles(currentPage, videoId),
  });

  return (
    <div>
      <div className="flex flex-col">
        <p className="text-zinc-200 text-center font-semibold h-[40px] flex items-center justify-center">
          Files for the video {videoTitle}.
        </p>
        <Pagination className="h-[40px]">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (currentPage === 1) {
                    return;
                  }
                  setCurrentPage(currentPage - 1);
                }}
                className={
                  currentPage === 1
                    ? "disabled cursor-not-allowed"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>{currentPage}</PaginationLink>
            </PaginationItem>
            <PaginationItem>... {data?.pageCount}</PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (currentPage >= data?.pageCount) {
                    return;
                  }
                  setCurrentPage(currentPage + 1);
                }}
                className={
                  currentPage >= data?.pageCount
                    ? "disabled cursor-not-allowed"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

        <div className="overflow-auto max-h-[calc(100vh-40px-40px)] w-full">
        {isLoading && (
          <div className="h-[100px] flex justify-center items-center">
            <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
          </div>
        )}

        {!isLoading && data?.files == null && (
          <div className="h-[100px] flex justify-center items-center">
            <span>No files found in pagae.</span>
          </div>
        )}

        {isError && (
          <div className="h-[100px] flex justify-center items-center">
            <span>An unexpected error occurred: {error.message}</span>
          </div>
        )}

        {data?.files?.map((file: FileResponse) => (
          <div key={file.id} className="bg-white">
            <div key={file.id} className="">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${file.path}`}
                className="w-full h-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
