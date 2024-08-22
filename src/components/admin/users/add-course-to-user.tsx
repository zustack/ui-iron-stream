import { userCourses } from "@/api/courses";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import {
  createUserCourse,
  deleteUserCoursesByCourseIdAndUserId,
} from "@/api/user-courses";
import { useState } from "react";

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
  const queryClient = useQueryClient();
  const [activeUpdateId, setActiveUpdateId] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-courses", userId],
    // is "" because we dont want to search a course here! or do we?
    queryFn: () => userCourses("", userId),
    enabled: isOpen,
  });

  const createUserCourseMutation = useMutation({
    mutationFn: ({ userId, courseId }: { userId: number; courseId: number }) =>
      createUserCourse(userId, courseId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-courses"] });
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  const deleteUserCoursesByCourseIdAndUserIdMutation = useMutation({
    mutationFn: ({ userId, courseId }: { userId: number; courseId: number }) =>
      deleteUserCoursesByCourseIdAndUserId(userId, courseId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-courses"] });
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <Button variant="outline" size="icon" className="h-8 gap-1 mx-1">
          <Plus className="h-5 w-5 text-zinc-200" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Agrega cursos al usuario</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col py-2 pb-4">
              <p>
                Nombre: {name} {surname}
              </p>
              <p>Email: {email}</p>
            </div>
            <ScrollArea className="h-[200px] w-[350px]p-4">
              {data && data.data.length === 0 && (
                <div className="text-center text-zinc-400">
                  No se encontraron resultados
                </div>
              )}

              {isLoading && (
                <div className="h-[100px] flex justify-center items-center">
                  <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                </div>
              )}

              {isError && (
                <div className="h-[100px] flex justify-center items-center">
                  Error: {error.message}
                </div>
              )}

              {data &&
                data.data.map((course: any) => (
                  <div className="flex items-center space-x-2 py-2">
                    {course.id === activeUpdateId &&
                    (createUserCourseMutation.isPending ||
                      deleteUserCoursesByCourseIdAndUserIdMutation.isPending) ? (
                      <Loader className="h-5 w-5 text-zinc-300 animate-spin slower items-center flex justify-center" />
                    ) : (
                      <Checkbox
                        checked={course.allowed}
                        onClick={() => {
                          setActiveUpdateId(course.id);
                          if (course.allowed) {
                            deleteUserCoursesByCourseIdAndUserIdMutation.mutate(
                              {
                                userId: userId,
                                courseId: course.id,
                              }
                            );
                          } else {
                            createUserCourseMutation.mutate({
                              userId: userId,
                              courseId: course.id,
                            });
                          }
                        }}
                        id="terms"
                      />
                    )}
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {course.title} {course.id}
                    </label>
                  </div>
                ))}
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
