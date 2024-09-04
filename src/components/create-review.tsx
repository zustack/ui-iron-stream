import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import StarIcon from "@mui/icons-material/Star";
import { Rating } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorResponse } from "@/types";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { createReview } from "@/api/reviews";
import { Loader } from "lucide-react";

export default function CreateReview() {
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(5);
  const { courseId } = useParams();

  const queryClient = useQueryClient();

  const createReviewMutation = useMutation({
    mutationFn: () => createReview(description, rating, courseId || ""),
    onSuccess: async () => {
      toast.success("Thank you for your feedback!");
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  return (
    <>
      <Textarea 
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Leave a review" />
      <div className="flex justify-between items-center">
        <Rating
          name="text-feedback"
          value={rating}
          onChange={(_, newValue) => {
            if (!newValue) return;
            setRating(newValue);
          }}
          precision={0.5}
          size="large"
          className="my-[20px]"
          icon={<StarIcon className="text-yellow-500" fontSize="large" />}
          emptyIcon={<StarIcon className="text-zinc-500" fontSize="large" />}
        />
        <Button
          disabled={createReviewMutation.isPending}
          onClick={() => createReviewMutation.mutate()}
        >
          {createReviewMutation.isPending && (
            <Loader className="h-6 w-6 text-zinc-900 animate-spin slower" />
          )}
          Create review
        </Button>
      </div>
    </>
  );
}
