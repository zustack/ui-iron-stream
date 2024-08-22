import { userCourses } from "@/api/courses";
import CourseCard from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { Loader, Search } from "lucide-react";
import { useEffect, useState, ChangeEvent } from "react";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { userId } = useAuthStore()

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
    <section className="">
      <form className="ml-auto flex-1 sm:flex-initial mb-8 mr-4 flex justify-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={handleInputChange}
            type="search"
            placeholder="Busca un curso ..."
            className="pl-8 w-[800px]"
          />
        </div>
      </form>

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
          <CourseCard key={course.id} course={course} />
        ))}
    </section>
  );
}
