import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Loader, Paperclip, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState, ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useParams } from "react-router-dom";
import { adminVideos } from "@/api/videos";
import CreateVideo from "@/components/admin/videos/create-video";
import UpdateVideo from "@/components/admin/videos/update-video";
import DeleteVideo from "@/components/admin/videos/delete-video";
import { WebviewWindow } from "@tauri-apps/api/window";
import VideoDialog from "@/components/admin/video-dialog";
import { Video } from "@/types";
import ImageDialog from "@/components/admin/image-dialog";

export default function AdminVideos() {
  const { courseId, courseTitle } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["admin-videos", debouncedSearchTerm],
    queryFn: () => adminVideos(debouncedSearchTerm, courseId),
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, 800);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchInput]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchInput(value);
  };

  const openWindowFile = async (id: number) => {
    try {
      // Crea una instancia de WebviewWindow
      const webview = new WebviewWindow("theUniqueLabel", {
        url: `new/window/admin/videos/files/${id}`,
      });

      // Escucha el evento 'tauri://created' para manejar el éxito
      webview.once("tauri://created", () => {
        console.log("Webview window successfully created");
      });

      // Escucha el evento 'tauri://error' para manejar errores
      webview.once("tauri://error", (error) => {
        console.error(
          "An error occurred during webview window creation:",
          error
        );
      });
    } catch (error) {
      console.error("Error creating webview window:", error);
    }
  };

  return (
    <>
      <div className="bg-muted/40 flex justify-between items-center px-[10px] h-[60px] border border-b">
        <Link
          to="/admin/courses"
          className="underline cursor-pointer flex text-zinc-200 items-center mr-9"
        >
          <ChevronLeft />
          <span>Go back</span>
        </Link>

        <div>
          <form className="ml-auto flex-1 sm:flex-initial mr-9">
            <div className="relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={handleInputChange}
                type="search"
                placeholder="Search videos"
                className="pl-8 w-[450px]"
              />
            </div>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-9">
          <p className="text-sm text-muted-foreground">
            Videos for the course{" "}
            <span className="font-semibold text-zinc-200">{courseTitle}</span>.
          </p>

          <p className="text-sm text-muted-foreground">
            {data == null ? (
              <div className="h-[100px] flex justify-center items-center">
                <span>No videos found.</span>
              </div>
            ) : (
              <span>
                {data?.length}{" "}
                {data?.length === 1 ? " course found." : " courses found."}
              </span>
            )}
          </p>

          <CreateVideo />
        </div>
      </div>
      <ScrollArea className="h-full max-h-[calc(100vh-10px-60px)] w-full p-[10px]">
        <Table>
          <TableCaption>
            {isFetching && (
              <div className="h-[100px] flex justify-center items-center">
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              </div>
            )}

            {data == null && (
              <div className="h-[100px] flex justify-center items-center">
                <span>No videos found.</span>
              </div>
            )}

            {isFetching && (
              <div className="h-[100px] flex justify-center items-center">
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              </div>
            )}

            {isError && (
              <div className="h-[100px] flex justify-center items-center">
                <span>An unexpected error occurred: {error.message}</span>
              </div>
            )}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Video</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((video: Video) => (
              <TableRow>
                <TableCell>{video.title}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {video.description.length > 20 ? (
                          <>{video.description.slice(0, 20)} ...</>
                        ) : (
                          <>{video.description}</>
                        )}
                      </TooltipTrigger>
                      <TooltipContent className="w-[400px]">
                        <p>{video.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{video.views}</TableCell>
                <TableCell>{video.duration}</TableCell>
                <TableCell>
                  <VideoDialog
                    src={`${import.meta.env.VITE_BACKEND_URL}${video.video_hls}`}
                    title={video.title}
                  />
                </TableCell>
                <TableCell>
                  <ImageDialog
                    title={video.title}
                    src={`${import.meta.env.VITE_BACKEND_URL}${video.thumbnail}`}
                  />
                </TableCell>
                <TableCell>{video.created_at}</TableCell>

                <TableCell className="text-right">
                  <Button
                    onClick={() => openWindowFile(video.id)}
                    variant="outline"
                    size="icon"
                    className="h-8 gap-1 mx-1"
                  >
                    <Paperclip className="h-5 w-5 text-zinc-200" />
                  </Button>

                  <UpdateVideo data={video} />

                  <DeleteVideo title={video.title} id={video.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
