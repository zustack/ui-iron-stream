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
import {
  ChevronLeft,
  ListFilter,
  Loader,
  Paperclip,
  Pencil,
  PlusCircle,
  Search,
  Trash,
  VideoIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect, useState, ChangeEvent } from "react";
import CreateCourse from "@/components/admin/courses/create-course";
import { useInView } from "react-intersection-observer";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { adminCourses, deleteCourse } from "@/api/courses";
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
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import UpdateCourse from "@/components/admin/courses/update-course";
import { Link, useParams } from "react-router-dom";
import { adminVideos, userVideos } from "@/api/videos";
import CreateVideo from "@/components/admin/videos/create-video";
import UpdateVideo from "@/components/admin/videos/update-video";

export default function AdminVideos() {
  const { courseId, courseTitle } = useParams();
  const [activeId, setActiveId] = useState(0);
  const [activeDeleteId, setActiveDeleteId] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [active, setActive] = useState<number | string>("");
  const [showSkeleton, setShowSkeleton] = useState(false);

  const queryClient = useQueryClient();

  const invalidateQuery = () => {
    setShowSkeleton(true);
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
    queryKey: ["admin-videos", debouncedSearchTerm, active],
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

  const deleteCourseMutation = useMutation({
    mutationFn: (id: number) => deleteCourse(id),
    onSuccess: () => {
      close();
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
    },
    onError: (error: ErrorResponse) => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast.error(error.response?.data?.error || "Ocurrió un error inesperado");
    },
  });

  useEffect(() => {
    if (!isFetching && showSkeleton) {
      setShowSkeleton(false);
    }
  }, [isFetching, showSkeleton]);

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
              <span>{data?.pages[0].totalCount} videos.</span>
            ) : null}
          </p>
          <CreateVideo invalidate={invalidateQuery} />
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
            {showSkeleton && (
              <TableRow>
                <TableCell colSpan={9}>
                  <Skeleton className="w-full h-[30px]" />
                </TableCell>
              </TableRow>
            )}

            {status != "pending" &&
              status != "error" &&
              data &&
              data.pages.map((page) => (
                <React.Fragment key={page.nextId}>
                  {page.data != null &&
                    page.data.map((course) => (
                      <TableRow
                        className={course.id === activeDeleteId ? "hidden" : ""}
                      >
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
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Button size="sm" className="h-8 gap-1">
                                Ver video
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
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
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Button size="sm" className="h-8 gap-1">
                                Ver imagen
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
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
                            variant="outline"
                            size="icon"
                            className="h-8 gap-1 mx-1"
                          >
                            <Paperclip className="h-5 w-5 text-zinc-200" />
                          </Button>

                          <UpdateVideo 
                          data={course} 
                          invalidate={invalidateQuery}/>


                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 gap-1 mx-1"
                              >
                                <Trash className="h-5 w-5 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Estas seguro de eliminar el curso{" "}
                                  {course.title}?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  <p>
                                    Esta operación no se puede deshacer. Procede
                                    con cuidado
                                  </p>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cerrar</AlertDialogCancel>
                                <AlertDialogAction>
                                  <Button
                                    onClick={() => {
                                      setActiveDeleteId(course.id);
                                      deleteCourseMutation.mutate(course.id);
                                    }}
                                    variant={"destructive"}
                                  >
                                    Eliminar
                                  </Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

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
