import { getCurrentVideo, getVideosByCourseId, newVideo } from "@/api/videos";
import { Button } from "@/components/ui/button";
import { useOsStore } from "@/store/os";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Command } from "@tauri-apps/api/shell";
import { useEffect, useState, ChangeEvent, useRef } from "react";
import { useParams } from "react-router-dom";
import { File, Loader, Pencil, Search, Trash } from "lucide-react";
import { getForbiddenApps } from "@/api/apps";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Hls from "hls.js";
import Plyr from "plyr";
import { plyrOptions } from "@/lib/plyr-options";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LoadImage from "@/components/load-image";
import { WebviewWindow } from "@tauri-apps/api/window";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { useAuthStore } from "@/store/auth";
import { createNote, deleteNote, getNotes, updateNote } from "@/api/notes";
import { foundAppsLog } from "@/api/user_log";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { createReview } from "@/api/reviews";

type App = {
  name: string;
  process_name: string;
};

export default function Video() {
  const { courseId } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const queryClient = useQueryClient();
  const [currentVideoId, setCurrentVideoId] = useState(0);
  const { os } = useOsStore();
  const [foundApps, setFoundApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(false);
  const { access } = useAuthStore();
  const [noteTime, setNoteTime] = useState(0.0);
  const [body, setBody] = useState("");
  const [currentNoteId, setCurrentNoteId] = useState(0);
  const [editingNote, setEditingNote] = useState(false);
  const [hoverNote, setHoverNote] = useState(0);
  const [mutationSent, setMutationSent] = useState(false);

  const [rVisible, setRVisible] = useState(true);
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(5);

  const createReviewMutation = useMutation({
    mutationFn: () => createReview(description, rating, courseId || ""),
    onSuccess: () => {
      setRVisible(false);
      toast.success("Thank you for your feedback!");
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["fobidden-apps"],
    queryFn: () => getForbiddenApps(),
  });

  const {
    data: notes,
    isLoading: lNotes,
    isError: eNotes,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: () => getNotes(courseId || ""),
  });

  async function killAppsAlways(process_name: string) {
    if (os === "darwin") {
      const command = new Command("kill-mac", [process_name]);
      await command.execute();
    }
    if (os === "win32") {
      const command = new Command("kill-win", [process_name]);
      await command.execute();
    }
    if (os === "linux") {
      console.log("aca es kill linux");
      const command = new Command("kill-linux", [process_name]);
      await command.execute();
    }
  }

  async function killApps(apps: App[]) {
    setLoading(true);
    if (os === "darwin") {
      for (const app of apps) {
        const command = new Command("kill-mac", [app.process_name]);
        await command.execute();
      }
    }
    if (os === "win32") {
      for (const app of apps) {
        const command = new Command("kill-win", [app.process_name]);
        await command.execute();
      }
    }
    if (os === "linux") {
      for (const app of apps) {
        const command = new Command("kill-linux", [app.process_name]);
        await command.execute();
      }
    }
    setFoundApps([]);
    setLoading(false);
    setMutationSent(false);
    videoRef.current?.play();
  }

  const foundAppsMutation = useMutation({
    mutationFn: (found: App[]) => foundAppsLog(currentVideo.video.title, found),
  });

  async function getLocalApps() {
    let commandName: string = "";
    if (os === "darwin") {
      commandName = "apps-mac";
    } else if (os === "win32") {
      commandName = "apps-win";
    } else if (os === "linux") {
      commandName = "apps-linux";
    } else {
      console.error("Unsupported platform");
      return;
    }
    const command = new Command(commandName);
    const output = await command.execute();
    const found = data.filter((item: any) => {
      if (item.execute_always && output.stdout.includes(item.process_name)) {
        killAppsAlways(item.process_name);
        return;
      }
      return output.stdout.includes(item.process_name);
    });
    if (found.length > 0) {
      videoRef.current?.pause();
      setMutationSent(true);
      if (!mutationSent) {
        foundAppsMutation.mutate(found);
      }
    }
    setFoundApps(found);
  }

  useEffect(() => {
    if (data) {
      const intervalId = setInterval(() => {
        getLocalApps();
      }, 1500);
      return () => clearInterval(intervalId);
    }
  }, [foundApps, data]);

  const {
    data: currentVideo,
    isLoading: isLoadingCurrentVideo,
    isFetching,
    isError: isErrorCurrentVideo,
  } = useQuery({
    queryKey: ["current-video"],
    queryFn: () => getCurrentVideo(courseId || ""),
    enabled: isSuccess,
  });

  useEffect(() => {
    if (currentVideo) {
      localStorage.setItem("historyId", currentVideo.history_id);
      const element = document.getElementById(currentVideo.video.id);
      if (element) {
        element.scrollIntoView();
      }

      const video = videoRef.current;
      if (!video) return;

      let videoSrc = `${import.meta.env.VITE_BACKEND_URL}${currentVideo.video.video_hls}`;
      const defaultOptions: Plyr.Options = plyrOptions;

      if (Hls.isSupported()) {
        const hls = new Hls({
          xhrSetup: function (xhr) {
            if (access) {
              xhr.setRequestHeader("Authorization", `Bearer ${access}`);
            }
          },
        });

        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          new Plyr(video, defaultOptions);
          video.currentTime = Number(currentVideo.resume);
          video.play().catch((e) => console.error("Error al reproducir:", e));
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
        video.addEventListener("canplay", () => {
          new Plyr(video, defaultOptions);
          video.currentTime = Number(currentVideo.resume);
          video.play().catch((e) => console.error("Error al reproducir:", e));
        });
      }
    }
  }, [currentVideo]);

  const {
    data: videos,
    isLoading: isLoadingVideos,
    isError: isErrorVideos,
  } = useQuery({
    queryKey: ["videos", debouncedSearchTerm],
    queryFn: () => getVideosByCourseId(courseId || "", debouncedSearchTerm),
    enabled: isSuccess,
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

  const newVideoMutation = useMutation({
    mutationFn: (video_id: number) =>
      newVideo(
        localStorage.getItem("historyId") || "",
        video_id,
        courseId || "",
        videoRef.current?.currentTime.toString() || "0",
        currentVideo.video.id
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-video"] });
      await queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const createNewNoteMutation = useMutation({
    mutationFn: () =>
      createNote(courseId || "", body, noteTime, currentVideo.video.title),
    onSuccess: async () => {
      setBody("");
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: (id: number) => updateNote(id, body),
    onSuccess: async () => {
      setBody("");
      setCurrentNoteId(0);
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const openFiles = async (videoId: number, videoTitle: string) => {
    try {
      const webview = new WebviewWindow("Files", {
        url: `files/${courseId}/${videoId}/${videoTitle}`,
      });
      webview.once("tauri://error", (error) => {
        toast.error("Error creating window to preview the files: " + error);
      });
    } catch (error) {
      toast.error("Error creating window to preview the files: " + error);
    }
  };

  if (isError) {
    return (
      <div className="text-center flex justify-center text-3xl">
        Something went wrong
      </div>
    );
  }

  return (
    <div className="lg:h-[calc(100vh-60px)] flex flex-col lg:flex-row overflow-hidden pt-[10px] px-[10px] gap-[10px] mx-auto">
      <div className="flex-1 w-full lg:flex-auto xl:w-[30%]">
        <div className="h-[100px] flex flex-col justify-between">
          <div className="flex gap-2">
            <Textarea
              onMouseDown={() => {
                setNoteTime(videoRef.current?.currentTime || 0);
              }}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Write a note"
              className="flex-grow"
            />

            {editingNote ? (
              <div className="flex flex-col gap-2">
                <Button
                  disabled={updateNoteMutation.isPending}
                  variant="outline"
                  className="self-end flex gap-2 w-full h-full"
                >
                  <span>Cancel edit</span>
                </Button>
                <Button
                  onClick={() => {
                    updateNoteMutation.mutate(currentNoteId);
                  }}
                  disabled={updateNoteMutation.isPending}
                  variant="outline"
                  className="self-end flex gap-2 w-full h-full"
                >
                  {updateNoteMutation.isPending && (
                    <Loader className="h-6 w-6 text-zinc-900 animate-spin slower" />
                  )}
                  <span>Save note</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  createNewNoteMutation.mutate();
                }}
                disabled={createNewNoteMutation.isPending}
                variant="outline"
                className="self-end flex gap-2"
              >
                {createNewNoteMutation.isPending && (
                  <Loader className="h-6 w-6 text-zinc-900 animate-spin slower" />
                )}
                <span>Save note</span>
              </Button>
            )}
          </div>
        </div>

        {lNotes && <Skeleton className="h-[660px] w-[1173px] rounded-xl" />}

        {eNotes && <p>Error with notes</p>}

        <div className="bg-zinc-900 rounded-[0.75rem] mt-[10px] overflow-auto h-[calc(100vh-60px-100px-30px)]">
          <div className="h-full p-2">
            {notes?.map((n: any) => (
              <div
                onMouseEnter={() => setHoverNote(n.id)}
                onMouseLeave={() => setHoverNote(0)}
                className={
                  currentNoteId === n.id
                    ? `bg-zinc-800 rounded-[0.75rem] cursor-pointer p-3 px-3 border-[0.5px] border-indigo-500`
                    : `hover:bg-zinc-800 rounded-[0.75rem] cursor-pointer 
                      transition-colors duration-200 p-3 px-3 my-1`
                }
              >
                <div className="flex justify-between">
                  <h1 className="text-zinc-200 font-semibold">
                    {n.video_title}
                  </h1>

                  <div className="flex gap-2">
                    {currentNoteId === n.id || hoverNote === n.id ? (
                      <div className="flex gap-2">
                        {deleteNoteMutation.isPending ? (
                          <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                        ) : (
                          <Trash
                            onClick={() => deleteNoteMutation.mutate(n.id)}
                            className="h-5 w-5 text-red-500 hover:text-red-600 cursor-pointer"
                          />
                        )}
                        <Pencil
                          onClick={() => {
                            setCurrentNoteId(n.id);
                            setBody(n.body);
                            setEditingNote(true);
                          }}
                          className="h-5 w-5 text-indigo-500 hover:text-indigo-600 cursor-pointer"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-indigo-500">{n.time}</p>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-zinc-200">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenedor central */}
      <div className="flex-1 lg:flex-auto w-full">
        {(isLoading || isFetching) && (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[660px] w-[1173px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[400px]" />
            </div>
          </div>
        )}

        {isErrorCurrentVideo && (
          <div className="h-[660px] w-[1173px] flex justify-center items-center rounded-xl bg-zinc-900">
            <p>Error reproducing video</p>
          </div>
        )}

        <div style={{ display: isFetching || isLoading ? "none" : "block" }}>
          <video id="video-player" ref={videoRef} autoPlay={true} />
          <div className="flex justify-between mt-2">
            <h1 className="text-zinc-200 text-2xl font-semibold">
              {currentVideo?.video.title}
            </h1>
            {currentVideo?.isFile && (
              <Button
                onClick={() =>
                  openFiles(currentVideo?.video.id, currentVideo?.video.title)
                }
                variant="outline"
                className="flex gap-1"
                size={"sm"}
              >
                <File className="h-4 w-4" />
                View files
              </Button>
            )}
          </div>
          <p className="text-zinc-400 mt-2">
            {currentVideo?.video.description}
          </p>

          {(currentVideo?.video.s_review && !currentVideo?.userHasReviewed && rVisible) && (
            <div className="mt-8">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Leave a review"
              />
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
                  icon={
                    <StarIcon className="text-yellow-500" fontSize="large" />
                  }
                  emptyIcon={
                    <StarIcon className="text-zinc-500" fontSize="large" />
                  }
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
            </div>
          )}
        </div>

        {foundApps?.length > 0 && (
          <AlertDialog open={foundApps?.length > 0}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>The following apps are open</AlertDialogTitle>
                <AlertDialogDescription>
                  <p>
                    To continue watching the video, you need to close the
                    applications
                  </p>
                  {foundApps.map((app: any) => (
                    <div className="pt-2" key={app.id}>
                      <li className="font-semibold">{app.name}</li>
                    </div>
                  ))}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  className="flex gap-1 w-[100px]"
                  disabled={loading}
                  onClick={() => killApps(foundApps)}
                >
                  {loading && (
                    <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                  )}
                  Close apps
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Contenedor playlist */}
      <div className="flex-1 w-full lg:flex-auto xl:w-[30%]">
        <form className="ml-auto flex-1 sm:flex-initial h-[50px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={handleInputChange}
              type="search"
              placeholder="Busca un video..."
              className="pl-8 w-full"
            />
          </div>
        </form>

        <div className="overflow-auto h-[calc(100vh-60px-50px-20px)]">
          <div className="bg-zinc-900 rounded-[0.75rem] h-full">
            {isErrorVideos && <span>Something went wrong</span>}

            {videos == null && searchInput != "" && !isLoadingVideos && (
              <span className="flex justify-center items-center pt-[10px] text-zinc-400">
                No results found for "{debouncedSearchTerm}"
              </span>
            )}

            {isLoadingVideos || isLoadingCurrentVideo || isLoading ? (
              <div className="h-[100px] flex justify-center items-center">
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              </div>
            ) : (
              <>
                {videos?.map((v: any) => (
                  <div
                    onClick={() => {
                      newVideoMutation.mutate(v.id);
                      setCurrentVideoId(v.id);
                    }}
                    id={v.id}
                    className={`${
                      (currentVideoId === 0 &&
                        v.id === (currentVideo && currentVideo.video.id)) ||
                      v.id === currentVideoId
                        ? "bg-zinc-800"
                        : ""
                    }
  mb-2 p-1 hover:bg-zinc-800 rounded-[0.75rem] cursor-pointer 
  transition-colors duration-200 border-indigo-600
`}
                  >
                    <div className="relative">
                      <div
                        className="
                      relative overflow-hidden rounded-[0.75rem]"
                      >
                        <LoadImage
                          cn="h-[189px] rounded-[0.75rem]"
                          src={`${import.meta.env.VITE_BACKEND_URL}${v.thumbnail}`}
                        />
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
                      </p>
                      <div className="flex gap-2 mt-2">
                        <p className="text-sm text-zinc-400">{v.duration}</p>
                        <p className="text-sm text-zinc-400">•</p>
                        <p className="text-sm text-zinc-400">{v.views} views</p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
