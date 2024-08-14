import { deactivateAllCourses, deactivateCourseForAllUsers, updateActiveStatusAllUser } from "@/api/users";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ErrorResponse } from "@/types";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { adminCourses, coursesByUserId } from "@/api/courses";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Loader } from "lucide-react";

export default function Deactivate() {
  const [isOpen, setIsOpen] = useState(false);

  const addCourseToUserMutation = useMutation({
    mutationFn: (action:boolean) => updateActiveStatusAllUser(action),
    onSuccess: () => {
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  const deactivateAllCoursesMutation = useMutation({
    mutationFn: () => deactivateAllCourses(),
    onSuccess: () => {
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  const deactivateCourseForAllUsersMutation = useMutation({
    mutationFn: (id:number) => deactivateCourseForAllUsers(id),
    onSuccess: () => {
      toast.success("Hey it's ok")
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

// deactivateCourseForAllUsers 

  const { ref, inView } = useInView();

  const queryClient = useQueryClient();

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["add-courses-to-user"],
    queryFn: async ({ pageParam }) => {
      return adminCourses({
        pageParam: pageParam ?? 0,
        searchParam: "",
        active: 1,
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);



  return (
    <AlertDialog
      onOpenChange={(open: boolean) => setIsOpen(open)}
      open={isOpen}
    >
      <AlertDialogTrigger>
        <Button size="sm" className="h-8 gap-1">
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Desactivar
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desactivar</AlertDialogTitle>
          <AlertDialogDescription>
            <h4 className="text-lg">Usuarios</h4>
            <div className="flex flex-col gap-2">
              <Button
              onClick={() => addCourseToUserMutation.mutate(false)}
              >Desactivar todos los usuarios</Button>
              <Button
              onClick={() => addCourseToUserMutation.mutate(true)}
              >Activar todos los usuarios</Button>
            </div>

            <h4 className="text-lg">Cursos</h4>
            <div className="flex flex-col gap-2">
              <Button
              onClick={() => deactivateAllCoursesMutation.mutate()}
              >Desactivar todos los cursos</Button>
            </div>

            <ScrollArea className="h-[200px] w-[350px]p-4">
              {status === "pending" ? (
                <div className="flex justify-center items-center h-[200px]">
                  <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                </div>
              ) : null}

              {status === "error" ? <span>Error: {error.message}</span> : null}

              {status != "pending" &&
                status != "error" &&
                data &&
                data.pages.map((page) => (
                  <React.Fragment key={page.nextId}>
                    {page.data != null &&
                      page.data.map((course) => (
                        <div className="flex items-center space-x-2 py-2">
                          <Button
                          onClick={() => {
                            deactivateCourseForAllUsersMutation.mutate(course.id)
                          }}
                          >
                            Desactivar
                          </Button>
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {course.title}
                          </label>
                        </div>
                      ))}
                  </React.Fragment>
                ))}

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
            </ScrollArea>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          <Button className="w-[100px]">Some action</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
