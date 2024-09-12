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
import { deleteReview } from "@/api/reviews";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { createAdminLog } from "@/api/admin_log";

type Props = {
  id: number;
  description: string;
  rating: number;
  author: string;
  course_title: string
};

export default function DeleteReview({
  id,
  description,
  rating,
  author,
  course_title
}: Props) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const createAdminLogMutation = useMutation({
    mutationFn: () => createAdminLog(`The review ${description} writen by ${author} in the course ${course_title} has been deleted`, "3"),
  });

  const deleteReviewMutation = useMutation({
    mutationFn: () => deleteReview(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
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
            Are you sure you want to delete this review?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col pb-4">
              <div className="flex gap-2 items-center">
                <p className="text-xl font-semibold">{course_title}</p>
              <Rating
                name="text-feedback"
                value={rating}
                readOnly
                precision={0.5}
                size="medium"
                icon={
                  <StarIcon className="text-yellow-500" fontSize="medium" />
                }
                emptyIcon={
                  <StarIcon className="text-zinc-500" fontSize="medium" />
                }
              />
              </div>
              <p className="pt-2">Author: {author}</p>
              <p className="">{description}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteReviewMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={() => {
              deleteReviewMutation.mutate();
            }}
            variant={"destructive"}
            disabled={deleteReviewMutation.isPending}
            className="flex gap-2"
          >
            Delete
            {deleteReviewMutation.isPending && (
              <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
