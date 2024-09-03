import { userCourses } from "@/api/courses";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  Loader,
  MessageSquareMore,
  Search,
  StarIcon,
  Video,
  Lock,
} from "lucide-react";
import { useEffect, useState, ChangeEvent } from "react";
import { Course } from "@/types";
import { Rating } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import LoadImage from "@/components/load-image";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigate = useNavigate();
  const { userId } = useAuthStore();

  const { data, isLoading, isError, error } = useQuery({
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
    <section className="container mx-auto mt-[10px]">

      <form className="ml-auto flex-1 sm:flex-initial mb-[10px] mr-4 flex justify-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={handleInputChange}
            type="search"
            placeholder="Search courses"
            className="pl-8 w-[800px]"
          />
        </div>
      </form>

      {data?.length === 0 && (
        <div className="text-center text-zinc-400">No courses found.</div>
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
      {data?.map((course: Course) => (
        <div className="bg-zinc-900 rounded-[0.75rem] grid grid-cols-1 xl:grid-cols-2 min-h-[379px] border mb-8">
          <div className="p-1">
            <LoadImage
              cn="rounded-[0.75rem] w-full h-full"
              src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
            />
          </div>
          <div className="flex flex-col justify-between p-4">
            <div>
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight leading-none text-zinc-200 mb-6">
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
                  emptyIcon={
                    <StarIcon className="text-zinc-700" fontSize="inherit" />
                  }
                />
                <p>{course.rating}</p>
                <Link to="/reviews" className="underline">
                  Read reviews
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
                    onClick={() => {
                      navigate(`/video/${course.id}`);
                    }}
                  >
                    Watch
                    <ChevronRight className="h-5 w-5" />
                  </Button>

                  <Button
                    onClick={() => navigate(`/reviews/create/${course.id}`)}
                  >
                    Create review
                    <MessageSquareMore className="h-5 w-5 ml-2" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => toast.error("No tienes acceso a este curso")}
                >
                  You don't have access to this course
                  <Lock className="h-5 w-5 ml-2" />
                </Button>
              )}

              {course.preview != "" && (
                <Button onClick={() => navigate(`/preview/${course.id}`)}>
                  Watch free preview
                  <Video className="h-5 w-5 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
