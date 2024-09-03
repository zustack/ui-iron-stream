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
import { Course, ErrorResponse } from "@/types";
import {
  createUserCourse,
  deleteUserCoursesByCourseIdAndUserId,
} from "@/api/user-courses";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          <AlertDialogTitle>Add courses to user</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col py-2 pb-4">
              <p>
                Name: {name} {surname}
              </p>
              <p>Email: {email}</p>
            </div>
            <ScrollArea className="h-[300px]">
              <Table className="p-1">
                <TableCaption>
                  {data?.length === 0 && (
                    <div className="text-center text-zinc-400">
                      No results found.
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
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Course title</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {data?.map((course: Course) => (
                      <TableRow>
                        <TableCell>
                          {course.id === activeUpdateId &&
                          (createUserCourseMutation.isPending ||
                            deleteUserCoursesByCourseIdAndUserIdMutation.isPending) ? (
                            <Loader className="h-5 w-5 text-zinc-300 animate-spin slower items-center flex justify-center" />
                          ) : (
                            <Checkbox
                              checked={course.is_user_enrolled}
                              onClick={() => {
                                setActiveUpdateId(course.id);
                                if (course.is_user_enrolled) {
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
                        </TableCell>
                        <TableCell>{course.title}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
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
