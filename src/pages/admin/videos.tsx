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
import React, { useEffect, useState, ChangeEvent } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
// import VideoHls from "@/components/admin/videos/video-hls";
import { WebviewWindow } from "@tauri-apps/api/window";

export default function AdminVideos() {
  const { courseId, courseTitle } = useParams();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const invalidateQuery = () => {
    setIsLoading(true);
    queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
  };

  const { ref, inView } = useInView();

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["admin-videos", debouncedSearchTerm],
    queryFn: async ({ pageParam }) => {
      return adminVideos({
        pageParam: pageParam ?? 0,
        searchParam: debouncedSearchTerm,
        courseId: courseId || "",
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (!isFetching && isLoading) {
      setIsLoading(false);
    }
  }, [isFetching, isLoading]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

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

  const openWindowFile = async (id:number) => {
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
      <div className="bg-muted/40 flex justify-between pt-2 pb-[10px] px-11 border border-b">
        <Link
          to="/admin/courses"
          className="underline cursor-pointer flex text-zinc-200 items-center mr-9"
        >
          <ChevronLeft />
          <span>Volver atras</span>
        </Link>

        <p className="flex text-zinc-200 items-center mr-9 font-semibold">
          <span>Curso: {courseTitle}</span>
        </p>
        <div>
          <form className="ml-auto flex-1 sm:flex-initial mr-9">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={handleInputChange}
                type="search"
                placeholder="Busca un curso por nombre, descripción, autor, etc ..."
                className="pl-8 w-[450px]"
              />
            </div>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-9">
          <p className="text-sm text-muted-foreground">
            {status !== "pending" && status !== "error" ? (
              <span>
                {data?.pages[0].totalCount}
                {data?.pages[0].totalCount == 1
                  ? " video encontrado"
                  : " videos encontrados"}
              </span>
            ) : null}
          </p>
          <CreateVideo isLoading={isLoading} invalidate={invalidateQuery} />
        </div>
      </div>
      <ScrollArea className="h-full max-h-[calc(100vh-4rem)] w-full p-11">
        <Table>
          <TableCaption>
            {status === "pending" ? (
              <div className="h-[100px] flex justify-center items-center">
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              </div>
            ) : null}

            {status === "error" ? <span>Error: {error.message}</span> : null}

            <div ref={ref} onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? (
                <div className="h-[100px] flex justify-center items-center">
                  <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                </div>
              ) : hasNextPage ? (
                ""
              ) : (
                ""
              )}
            </div>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Titulo</TableHead>
              <TableHead>Descripcion</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Video</TableHead>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Fecha de creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {status != "pending" &&
              status != "error" &&
              data &&
              data.pages.map((page) => (
                <React.Fragment key={page.nextId}>
                  {page.data != null &&
                    page.data.map((course) => (
                      <TableRow>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {course.description.length > 20 ? (
                                  <>
                                    {course.description.slice(0, 20)}
                                    <span className="text-blue-500 cursor-pointer">
                                      ...ver mas
                                    </span>
                                  </>
                                ) : (
                                  <>{course.description}</>
                                )}
                              </TooltipTrigger>
                              <TooltipContent className="w-[400px]">
                                <p>{course.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>{course.views}</TableCell>
                        <TableCell>{course.duration}</TableCell>
                        <TableCell>
                          <VideoHls
                            src={`${import.meta.env.VITE_BACKEND_URL}${course.video_hls}`}
                          />
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Button size="sm" className="h-8 gap-1">
                                Ver imagen
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-5xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Imagen del curso {course.title}.
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  <img
                                    className="rounded-lg"
                                    src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
                                  />
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cerrar</AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                        <TableCell>{course.created_at}</TableCell>

                        <TableCell className="text-right">
                          <Button
                            onClick={() => openWindowFile(course.id)}
                            variant="outline"
                            size="icon"
                            className="h-8 gap-1 mx-1"
                          >
                            <Paperclip className="h-5 w-5 text-zinc-200" />
                          </Button>

                          <UpdateVideo
                            isLoading={isLoading}
                            data={course}
                            invalidate={invalidateQuery}
                          />

                          <DeleteVideo
                            isLoading={isLoading}
                            id={course.id}
                            invalidate={invalidateQuery}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
