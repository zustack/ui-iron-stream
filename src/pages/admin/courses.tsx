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
  ListFilter,
  Loader,
  Pencil,
  PlusCircle,
  Search,
  Trash,
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
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { adminCourses } from "@/api/courses";
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

export default function AdminCourses() {
  const [openCreateCourse, setOpenCreateCourse] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [active, setActive] = useState<number | string>(1);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const queryClient = useQueryClient();

  const invalidateQuery = () => {
    setShowSkeleton(true);
    queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
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
    queryKey: ["admin-courses", debouncedSearchTerm, active],
    queryFn: async ({ pageParam }) => {
      return adminCourses({
        pageParam: pageParam ?? 0,
        searchParam: debouncedSearchTerm,
        active: active,
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    initialPageParam: 0,
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

  if (openCreateCourse) {
    return (
      <CreateCourse
        invalidate={invalidateQuery}
        close={() => setOpenCreateCourse(false)}
      />
    );
  }

  return (
    <>
      <div className="bg-muted/40 flex justify-between pt-2 pb-[10px] px-11 border border-b">
        <div>
          <form className="ml-auto flex-1 sm:flex-initial mr-4">
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

        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {status !== "pending" && status !== "error" ? (
              <span>{data?.pages[0].totalCount} cursos.</span>
            ) : null}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filtrar
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                onClick={() => setActive("")}
                checked={active === ""}
              >
                Ninguno
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => setActive(1)}
                checked={active === 1}
              >
                Activo
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => setActive(0)}
                checked={active === 0}
              >
                No Activo
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span
              onClick={() => setOpenCreateCourse(true)}
              className="sr-only sm:not-sr-only sm:whitespace-nowrap"
            >
              Crear curso
            </span>
          </Button>
        </div>
      </div>
      <ScrollArea className="h-full max-h-[calc(100vh-4rem)] w-full p-11">
        <Table>
          <TableCaption>
            {status === "pending" ? (
              <div className="h-[calc(40vh-4rem)] flex justify-center items-center">
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              </div>
            ) : null}

            {status === "error" ? <span>Error: {error.message}</span> : null}

            <div ref={ref} onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? (
                <div className="h-[calc(40vh-4rem)] flex justify-center items-center">
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
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Titulo</TableHead>
              <TableHead>Descripcion</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Duration</TableHead>
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
                      <TableRow>
                        <TableCell>
                          <Checkbox checked={course.is_active} />
                        </TableCell>
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
                        <TableCell>{course.author}</TableCell>
                        <TableCell>{course.duration}</TableCell>
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
                            <Trash className="h-5 w-5 text-red-500" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 gap-1 mx-1"
                          >
                            <Pencil className="h-5 w-5 text-indigo-500" />
                          </Button>
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
