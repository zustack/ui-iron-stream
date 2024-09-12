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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { useState } from "react";
import { deleteCourse } from "@/api/courses";
import { createAdminLog } from "@/api/admin_log";

type Props = {
  id: number;
  title: string;
};

export default function DeleteCourse({ id, title }: Props) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const createAdminLogMutation = useMutation({
    mutationFn: () => createAdminLog(`The course ${title} has been deleted`, "3"),
  });

  const deleteCourseMutation = useMutation({
    mutationFn: () => deleteCourse(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      createAdminLogMutation.mutate()
      setIsOpen(false);
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <Button variant="outline" size="icon" className="h-8 gap-1 mx-1">
          <Trash className="h-5 w-5 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete {title}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p>This operation cannot be reverted, proceed with caution.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
          disabled={deleteCourseMutation.isPending}
          >Cancel</AlertDialogCancel>
          <Button
            onClick={() => {
              deleteCourseMutation.mutate();
            }}
            variant={"destructive"}
            disabled={deleteCourseMutation.isPending}
            className="flex gap-2"
          >
            Delete
            {deleteCourseMutation.isPending && (
              <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
