import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "../assets/image.png";
import { Loader, Search } from "lucide-react";
import { Input } from "./ui/input";
import { useLocation, useParams } from "react-router-dom";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { newVideo, userVideos } from "@/api/videos";
import { useInView } from "react-intersection-observer";
import React, { useEffect, useState, ChangeEvent, useRef } from "react";

export default function VideoFeed({
  resume,
  history_id,
  current_video_id,
}: any) {
  const { courseId } = useParams();

  const queryClient = useQueryClient();

  const newVideoMutation = useMutation({
    mutationFn: (video_id: string) =>
      newVideo(
        String(history_id),
        video_id,
        courseId || "",
        String(resume),
        current_video_id
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-video"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: (response) => {
      //@ts-ignore
      toast.error(response.response.data.error);
    },
  });

  const { ref, inView } = useInView();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const sectionRef = useRef(null);

  const scrollToId = () => {
    const element = document.getElementById(current_video_id);
    if (element) {
      element.scrollIntoView();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToId();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["admin-videos", debouncedSearchTerm],
    queryFn: async ({ pageParam }) => {
      return userVideos({
        pageParam: pageParam ?? 0,
        searchParam: debouncedSearchTerm,
        courseId: courseId || "",
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
    <>
      <form className="ml-auto flex-1 sm:flex-initial mb-4 mr-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={handleInputChange}
            type="search"
            placeholder="Busca un video..."
            className="pl-8 w-full"
          />
        </div>
      </form>
      <ScrollArea className="h-[715px] w-full pr-4">
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
                page.data.map((v) => (
                  <div
                    id={String(v.id)}
                    onClick={() => newVideoMutation.mutate(String(v.id))}
                    className={`
  ${v.id === current_video_id ? "bg-zinc-800" : ""}
  mb-2 p-1 hover:bg-zinc-800 rounded-[0.75rem] cursor-pointer 
  transition-colors duration-200 border-indigo-600
`}
                  >
                    <div className="relative">
                      <div
                        className="
                      relative overflow-hidden rounded-[0.75rem]"
                      >
                        <img 
      src={`${import.meta.env.VITE_BACKEND_URL}${v.thumbnail}`}
                        alt="" className="w-full" />
                        <div
                          style={{ width: `${v.video_resume}%` }}
                          className={`absolute 
                    bottom-0 left-0 
                    h-[6px] bg-indigo-600 rounded-b-[0.75rem]`}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-col mx-2">
                      <h4 className="font-semibold mt-2">{v.title}</h4>
                      <p className="text-sm text-zinc-200 mt-2">
                        {v.description}
                        {v.id === current_video_id && (
                          <span className="text-indigo-600"> (playing)</span>
                        )}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <p className="text-sm text-zinc-400">{v.duration}</p>
                        <p className="text-sm text-zinc-400">•</p>
                        <p className="text-sm text-zinc-400">{v.views} views</p>
                      </div>
                    </div>
                  </div>
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

      </ScrollArea>
    </>
  );
}
