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
  const { courseId, videoId, videoTitle } = useParams();

  const [page, setPage] = useState({
    pages: [1],
    currentPage: 0,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["files", page],
    queryFn: () => getFiles(page.pages[page.currentPage], videoId),
  });

  const nextPage = () => {
    if (page.currentPage < page.pages.length - 1) {
      setPage((prevState) => ({
        ...prevState,
        currentPage: prevState.currentPage + 1,
      }));
    }
  };
  const prevPage = () => {
    if (page.currentPage > 0) {
      setPage((prevState) => ({
        ...prevState,
        currentPage: prevState.currentPage - 1,
      }));
    }
  };

  console.log(data)

  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => prevPage()}
              className={
                page.currentPage === 0
                  ? "disabled cursor-not-allowed"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>{page.pages[page.currentPage]}</PaginationLink>
          </PaginationItem>
          <PaginationItem>... {page.pages.length}</PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={nextPage}
              className={
                page.currentPage === page.pages.length - 1
                  ? "disabled cursor-not-allowed"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

        {isLoading && (
          <div className="h-[100px] flex justify-center items-center">
            <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
          </div>
        )}

        {(!isLoading && data?.files == null) && (
          <div className="h-[100px] flex justify-center items-center">
            <span>No files found in page {page.currentPage + 1}.</span>
          </div>
        )}

        {isError && (
          <div className="h-[100px] flex justify-center items-center">
            <span>An unexpected error occurred: {error.message}</span>
          </div>
        )}

        {data?.files.map((file: FileResponse) => (
          <div key={file.id} className="bg-white rounded-[0.75rem]">
            <div key={file.id} className="">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${file.path}`}
                className="w-full h-full"
              />
            </div>
          </div>
        ))}
    </div>
  );
}
