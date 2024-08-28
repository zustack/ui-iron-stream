import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ErrorResponse, FileResponse } from "@/types";
import { deleteFile, getFiles, uploadFile } from "@/api/files";
import { useState, ChangeEvent, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, FileImage, Loader, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export default function WindowFiles() {
  const { courseId, courseTitle, videoId, videoTitle } = useParams();
  const [file, setFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [currentFileId, setCurrentFileId] = useState<number>(0);
  const [newPage, setNewPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["files", currentPage, videoId],
    queryFn: () => getFiles(currentPage, videoId),
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const uploadFileMutation = useMutation({
    mutationFn: () => {
      if (!file || !videoId) {
        throw new Error("File or videoId not found");
      }
      return uploadFile(file, newPage, videoId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["files"] });
      toast.success("File uploaded successfully");
      setFile(undefined);
      setCurrentPage(newPage);
      setNewPage(0);
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: (id: number) => deleteFile(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["files"] });
      toast.success("File deleted successfully");
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  return (
    <div>
      <div className="bg-muted/40 flex justify-between items-center px-[10px] h-[60px] border border-b">
        <Link
          to={`/admin/videos/${courseId}/${courseTitle}`}
          className="underline cursor-pointer flex text-zinc-200 items-center mr-9"
        >
          <ChevronLeft />
          <span>Go back</span>
        </Link>

        <div className="ml-auto flex items-center gap-9">
          <p className="text-sm text-muted-foreground">
            Files for the video{" "}
            <span className="font-semibold text-zinc-200">{videoTitle}</span>.
          </p>

          <p className="text-sm text-muted-foreground">
            {data == null ? (
              <div className="h-[100px] flex justify-center items-center">
                <span>No files found in page {data?.pageCount}.</span>
              </div>
            ) : (
              <span>
                {data?.length}{" "}
                {data?.length === 1 ? " file found." : " files found."}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 items-center px-[10px] h-[60px]">
        <div className="flex gap-2 col-start-1 col-end-3">
          <div className="grid gap-2 w-[400px]">
            <Button
              id="file"
              onClick={() => inputRef.current?.click()}
              variant="outline"
              className="flex justify-start gap-4"
            >
              <FileImage className="size-4" />
              <span>
                {file?.name ? (
                  <>{file?.name.slice(0, 40)}</>
                ) : (
                  <>SVG recommended</>
                )}
              </span>
            </Button>
            <Input
              ref={inputRef}
              required
              onChange={handleFileChange}
              id="file"
              type="file"
              className="hidden"
              accept=".svg,image/svg+xml"
            />
          </div>
          <Button
            disabled={!file || uploadFileMutation.isPending}
            onClick={() => {
              uploadFileMutation.mutate();
            }}
            variant="default"
            className="flex gap-2"
          >
            <span>Upload file</span>
            {uploadFileMutation.isPending && (
              <Loader className="h-6 w-6 text-zinc-900 animate-spin slower items-center flex justify-center" />
            )}
          </Button>
        </div>

        <div className="col-start-3 col-end-5 flex">
          <Pagination>
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
                <PaginationLink>
                  {newPage != 0 ? `${newPage}` : `${currentPage}`}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>... {data?.pageCount}</PaginationItem>

              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 gap-1 mx-1"
                  onClick={() => {
                    setNewPage(data?.pageCount + 1);
                  }}
                >
                  <Plus className="h-4 w-4 text-zinc-200" />
                </Button>
              </PaginationItem>
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
      </div>

      <ScrollArea className="h-full max-h-[calc(100vh-60px-60px)] w-full px-[10px]">
        {newPage != 0 ? (
          <p></p>
        ) : (
          <>
            {isLoading && (
              <div className="h-[100px] flex justify-center items-center">
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              </div>
            )}

            {!isLoading && data == null && (
              <div className="h-[100px] flex justify-center items-center">
                <span>No files found in page {data.pageCount}.</span>
              </div>
            )}

            {isError && (
              <div className="h-[100px] flex justify-center items-center">
                <span>An unexpected error occurred: {error.message}</span>
              </div>
            )}

            {data?.files?.map((file: FileResponse) => (
              <div key={file.id} className="bg-white rounded-[0.75rem]">
                <div key={file.id} className="">
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        setCurrentFileId(file.id);
                        deleteFileMutation.mutate(file.id);
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-18 w-18 gap-1 hover:bg-white"
                    >
                      {deleteFileMutation.isPending &&
                      file.id === currentFileId ? (
                        <Loader className="h-12 w-12 text-zinc-600 animate-spin slower" />
                      ) : (
                        <Trash className="h-12 w-12 text-red-600 hover:text-red-700" />
                      )}
                    </Button>
                  </div>
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${file.path}`}
                    className="w-full h-full"
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  );
}
