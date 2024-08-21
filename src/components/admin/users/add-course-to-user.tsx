import { adminCourses, coursesByUserId, userCourses } from "@/api/courses";
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
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-coursess"],
    // is "" because we dont want to search a course here!
    queryFn: () => adminCourses("", ""),
  });

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
            Agrega cursos al usuario {name} {surname}, email: {email}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <ScrollArea className="h-[200px] w-[350px]p-4">
              {data && data.length === 0 && (
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
                data.map((course: any) => (
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
