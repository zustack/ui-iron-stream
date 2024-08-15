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
  GraduationCap,
  ListFilter,
  Loader,
  Plus,
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
import { adminCourses, deleteCourse, sortCourses } from "@/api/courses";
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
import { Link } from "react-router-dom";
import {
  adminUsers,
  deleteAccountAtRegister,
  updateActiveStatus,
} from "@/api/users";
import AddCouseToUser from "@/components/admin/users/add-course-to-user";
import Deactivate from "@/components/admin/users/deactivate";
import SpecialApps from "@/components/admin/users/special-apps";
import TrueSpecialApps from "@/components/admin/users/true-special-apps";

export default function AdminUsers() {
  const [activeDeleteId, setActiveDeleteId] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [activeParam, setActiveParam] = useState<number | string>("");
  const [adminParam, setAdminParam] = useState<number | string>("");
  const [specialParam, setSpecialParam] = useState<number | string>("");
  const [verifiedParam, setVerifiedParam] = useState<number | string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSort, setIsLoadingSort] = useState(false);

  const invalidateQuery = () => {
    setIsLoading(true);
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const queryClient = useQueryClient();

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
    queryKey: [
      "admin-users",
      debouncedSearchTerm,
      activeParam,
      adminParam,
      specialParam,
      verifiedParam,
    ],
    queryFn: async ({ pageParam }) => {
      return adminUsers({
        pageParam: pageParam ?? 0,
        searchParam: debouncedSearchTerm,
        active: activeParam,
        admin: adminParam,
        special: specialParam,
        verified: verifiedParam,
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    initialPageParam: 0,
  });

  const deleteUserMutation = useMutation({
    mutationFn: (email: string) => deleteAccountAtRegister(email),
    onSuccess: () => {
      invalidateQuery();
    },
    onError: (error: ErrorResponse) => {
      // queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.error(error.response?.data?.error || "Ocurrió un error inesperado");
    },
  });

  const updateActiveMutation = useMutation({
    mutationFn: (user_id: number) => updateActiveStatus(user_id),
    onSuccess: () => {
      invalidateQuery();
    },
    onError: (error: ErrorResponse) => {
      // queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.error(error.response?.data?.error || "Ocurrió un error inesperado");
    },
  });

  useEffect(() => {
    if (!isFetching && isLoadingSort) {
      setIsLoadingSort(false);
    }
  }, [isFetching, isLoadingSort]);

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
      const backendSearchInput = searchInput.replace(/ /g, "&");
      setDebouncedSearchTerm(backendSearchInput);
    }, 800);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchInput]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchInput(value);
  };

  console.log(data)

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
                placeholder="Example Agustin&11:18"
                className="pl-8 w-[450px]"
              />
            </div>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {status !== "pending" && status !== "error" ? (
              <span>{data?.pages[0].totalCount} usuarios.</span>
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
                onClick={() => {
                  if (activeParam === 1) {
                    setActiveParam("");
                  } else {
                    setActiveParam(1);
                  }
                }}
                checked={activeParam === 1}
              >
                Activo
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  if (adminParam === 1) {
                    setAdminParam("");
                  } else {
                    setAdminParam(1);
                  }
                }}
                checked={adminParam === 1}
              >
                Admin
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                onClick={() => {
                  if (verifiedParam === 1) {
                    setVerifiedParam("");
                  } else {
                    setVerifiedParam(1);
                  }
                }}
                checked={verifiedParam === 1}
              >
                Verificado
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  if (specialParam === 1) {
                    setSpecialParam("");
                  } else {
                    setSpecialParam(1);
                  }
                }}
                checked={specialParam === 1}
              >
                Apps
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Deactivate 
          />

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

            {isLoadingSort ? (
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
              <TableHead className="w-[100px]">
                Activo
              </TableHead>
              <TableHead className="w-[100px]">Admin</TableHead>
              <TableHead className="w-[100px]">Verificado</TableHead>
              <TableHead className="w-[100px]">Apps</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Pc</TableHead>
              <TableHead>Sistema operativo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          {isLoadingSort ? (
            <></>
          ) : (
            <TableBody>
              {status != "pending" &&
                status != "error" &&
                data &&
                data.pages.map((page) => (
                  <React.Fragment key={page.nextId}>
                    {page.data != null &&
                      page.data.map((course) => (
                        <>
                          {course.id === activeDeleteId &&
                          (isLoading || deleteUserMutation.isPending) ? (
                            <TableRow>
                              <TableCell colSpan={11}>
                                <Skeleton className="w-full h-[30px]" />
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow>
                              <TableCell>
                                <Checkbox
                                  onClick={() =>
                                    updateActiveMutation.mutate(course.id)
                                  }
                                  checked={course.is_active}
                                />
                              </TableCell>

                              <TableCell>
                                <Checkbox checked={course.isAdmin} />
                              </TableCell>

                              <TableCell>
                                <Checkbox checked={course.verified} />
                              </TableCell>

                              <TableCell>
                                <Checkbox checked={course.special_apps} />
                                  {course.special_apps ? (
                                    <TrueSpecialApps
                                  specialApps={course.special_apps}
                                  userId={course.id} />
                                  ) : (
                                  <SpecialApps 
                                  specialApps={course.special_apps}
                                  userId={course.id} />
                                  )}
                              </TableCell>

                              <TableCell>{course.email}</TableCell>
                              <TableCell>{course.name}</TableCell>
                              <TableCell>{course.surname}</TableCell>
                              <TableCell>{course.pc}</TableCell>
                              <TableCell>{course.os}</TableCell>
                              <TableCell>{course.created_at}</TableCell>

                              <TableCell className="text-right">
                                <AddCouseToUser
                                  email={course.email}
                                  name={course.name}
                                  surname={course.surname}
                                  userId={course.id}
                                />
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
                                        {course.name}?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        <p>
                                          Esta operación no se puede deshacer.
                                          Procede con cuidado
                                        </p>
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cerrar
                                      </AlertDialogCancel>
                                      <AlertDialogAction>
                                        <Button
                                          onClick={() => {
                                            deleteUserMutation.mutate(
                                              course.email
                                            );
                                            setActiveDeleteId(course.id);
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
                          )}
                        </>
                      ))}
                  </React.Fragment>
                ))}
            </TableBody>
          )}
        </Table>
      </ScrollArea>
    </>
  );
}
