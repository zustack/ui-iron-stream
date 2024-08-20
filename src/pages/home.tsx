import { userCourses } from "@/api/courses";
import CourseCard from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader, Search } from "lucide-react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const { ref, inView } = useInView();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["user-courses", debouncedSearchTerm],
    queryFn: async ({ pageParam }) => {
      return userCourses({
        pageParam: pageParam ?? 0,
        searchParam: debouncedSearchTerm,
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

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
      {status === "pending" ? (
        <div className="h-[100px] flex justify-center items-center">
          <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
        </div>
      ) : null}

      {status === "error" ? <span>Error: {error.message}</span> : null}

      {status != "pending" &&
        status != "error" &&
        data &&
        data.pages.map((page) => (
          <React.Fragment key={page.nextId}>
            {page.data != null &&
              page.data.map((course) => (
                <>
                  <CourseCard course={course} />
                </>
              ))}
          </React.Fragment>
        ))}

      <div ref={ref} onClick={() => fetchNextPage()}>
        {isFetchingNextPage ? (
          <div className="h-[100px] flex justify-center items-center">
            <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
          </div>
        ) : hasNextPage ? (
          ""
        ) : (
          ""
        )}
      </div>
    </section>
  );
}
