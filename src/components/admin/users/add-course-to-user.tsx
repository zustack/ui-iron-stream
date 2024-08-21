import { coursesByUserId } from "@/api/courses";
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
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addCourseToUser } from "@/api/users";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";

type Props = {
  userId: number;
  email: string;
  name: string;
  surname: string;
};

export default function AddCouseToUser({
  userId,
  email,
  name,
  surname,
}: Props) {
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
    queryKey: ["add-courses-to-user", userId],
    queryFn: async ({ pageParam }) => {
      return coursesByUserId({
        pageParam: pageParam ?? 0,
        searchParam: "",
        id: userId,
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

  type AddCourseToUserPayload = {
    user_id: number;
    courses: number;
  };

  const addCourseToUserMutation = useMutation({
    mutationFn: (payload: AddCourseToUserPayload) =>
      addCourseToUser(payload.user_id, payload.courses),
    onSuccess: () => {
      toast.success("hey es success");
      queryClient.invalidateQueries({ queryKey: ["add-courses-to-user"] });
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="outline" size="icon" className="h-8 gap-1 mx-1">
          <Plus className="h-5 w-5 text-zinc-200" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Agrega cursos al usuario{" "}
            <span className="text-indigo-400">
              {name} {surname} idd::: {userId}
            </span>
            con el correo electronico{" "}
            <span className="text-indigo-400">{email}</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
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
                          <Checkbox
                            checked={course.allowed}
                            onClick={() => {
                              addCourseToUserMutation.mutate({
                                user_id: userId,
                                courses: course.id,
                              });
                            }}
                            id="terms"
                          />
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
