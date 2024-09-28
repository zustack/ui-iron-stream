import { userCourses } from "@/api/courses";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  Search,
  Video,
  Lock,
} from "lucide-react";
import { useEffect, useState, ChangeEvent } from "react";
import { Course } from "@/types";
import StarIcon from "@mui/icons-material/Star";
import { Rating } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LoadImage from "@/components/load-image";
import Spinner from "@/components/ui/spinner";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigate = useNavigate();
  const { userId } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["home-courses", debouncedSearchTerm],
    queryFn: () => userCourses(debouncedSearchTerm, userId),
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, 800);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchInput]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchInput(value);
  };

  return (
    <section className="container mx-auto">
      <form className="ml-auto flex-1 sm:flex-initial my-[20px] mr-4 flex justify-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={handleInputChange}
            type="search"
            placeholder="Search"
            className="pl-8 w-[800px]"
          />
        </div>
      </form>

      {data?.length === 0 && (
        <div className="text-center text-base">No courses found.</div>
      )}

      {isLoading && (
        <div className="h-[100px] flex justify-center items-center">
          <Spinner />
        </div>
      )}

      {isError && (
        <div className="h-[100px] flex justify-center items-center">
          An unexpected error occurred.
        </div>
      )}

      <div className="flex flex-col gap-[20px]">
      {data?.map((course: Course) => (
        <div className="bg-zinc-900 rounded-[0.75rem] grid grid-cols-1 xl:grid-cols-2 min-h-[379px] border">
          <div className="p-1">
            <LoadImage
              cn="rounded-[0.75rem] w-full h-full"
              src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
            />
          </div>
          <div className="flex flex-col justify-between p-4">
            <div>
              <h1 className="bold max-w-2xl text-4xl font-bold tracking-tight leading-none text-zinc-200 mb-6">
                {course.title}
              </h1>
              <p className="max-w-2xl text-zinc-200 mb-4">{course.author}</p>
              <p className="max-w-2xl text-zinc-200 mb-4">
                {course.description}
              </p>
              <div className="flex gap-2 mb-6">
                <Rating
                  name="text-feedback"
                  value={course.rating}
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
                <p>
                {course.rating}
                </p>
                <Link to={`/reviews/${course.id}`} className="underline text-blue-600 hover:text-blue-500">
                  Go to reviews
                </Link>
              </div>

              <p className="max-w-2xl text-muted-foreground mb-6">
                {course.duration}
              </p>
            </div>
            <div className="flex gap-2 mt-auto flex-col lg:flex-row">
              {course.is_user_enrolled ? (
                <>
                  <Button
                    className="button-md bg-blue-600 hover:bg-blue-500 text-white"
                    onClick={() => {
                      navigate(`/video/${course.id}`);
                    }}
                  >
                    Watch course
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Button
                className="button-md"
                >
                  You don't have access to this course
                  <Lock className="h-5 w-5 ml-2" />
                </Button>
              )}

              {course.preview != "" && (
                <Button 
                className="button-md"
                onClick={() => navigate(`/preview/${course.id}`)}>
                  Watch free preview
                  <Video className="h-5 w-5 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
        </div>
    </section>
  );
}
