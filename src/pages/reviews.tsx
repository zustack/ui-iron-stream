import { Separator } from "@/components/ui/separator";
import { Rating } from "@mui/material";
import { useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import { useQuery } from "@tanstack/react-query";
import { getPublicReviews } from "@/api/reviews";
import { Loader } from "lucide-react";
import CreateReview from "@/components/create-review";

export default function Reviews() {
  const { courseId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reviews", courseId],
    queryFn: () => getPublicReviews(courseId || ""),
  });

  return (
    <div className="flex justify-center pt-[10px]">
      <div className="w-[600px]">
        <h3 className="font-bold text-3xl pb-[20px]">
          Data structures and algorithms reviews
        </h3>

        {data?.show && (
          <div className="mb-[20px]">
          <CreateReview />
          </div>
        )}

        {isLoading && (
          <div className="h-[100px] flex justify-center items-center">
            <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
          </div>
        )}

        {isError && (
          <div className="h-[100px] flex justify-center items-center">
            <span>An unexpected error occurred: {error.message}</span>
          </div>
        )}

        {data?.data?.map((r: any) => (
          <>
            <Separator className="my-[20px]" />
            <h4 className="font-semibold">{r.author}</h4>
            <p className="text-sm text-zinc-300 mt-1">{r.created_at}</p>
            <Rating
              name="text-feedback"
              value={r.rating}
              readOnly
              precision={0.5}
              size="medium"
              className="my-[20px]"
              icon={<StarIcon className="text-yellow-500" fontSize="medium" />}
              emptyIcon={
                <StarIcon className="text-zinc-500" fontSize="medium" />
              }
            />
            <p className="text-zinc-300">{r.description}</p>
          </>
        ))}
      </div>
    </div>
  );
}
