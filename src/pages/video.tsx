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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["fobidden-apps"],
    queryFn: () => getForbiddenApps(),
  });

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
    videoRef.current?.play();
  }

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
    const found = data.filter((item: App) =>
      output.stdout.includes(item.process_name)
    );
    if (found.length > 0) {
      videoRef.current?.pause();
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
    enabled: !!data,
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
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          new Plyr(video, defaultOptions);
          video.play().catch((e) => console.error("Error al reproducir:", e));
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
        video.addEventListener("canplay", () => {
          new Plyr(video, defaultOptions);
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
    enabled: !!currentVideo,
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
    mutationFn: (video_id: string) =>
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
    onError: (response) => {
      //@ts-ignore
      toast.error(response.response.data.error);
    },
  });

  if (isErrorVideos || isErrorCurrentVideo || isError) {
    return (
      <div className="text-center flex justify-center text-3xl">
        Something went wrong
      </div>
    );
  }

  return (
    <div className="lg:h-[calc(100vh-60px)] flex flex-col lg:flex-row overflow-hidden pt-[10px] px-[10px] gap-[10px] mx-auto">
      {/* Contenedor notas */}
      <div className="flex-1 w-full lg:flex-auto xl:w-[30%]">
        <div className=" h-[100px] flex flex-col justify-between">
          <div className="flex gap-2">
            <Textarea
              rows={4}
              placeholder="Write a note"
              className="flex-grow"
            />
            <Button variant="outline" className="self-end">
              Save Note
            </Button>
          </div>
        </div>
        <div className="bg-zinc-900 rounded-[0.75rem] mt-[10px] overflow-auto h-[calc(100vh-60px-100px-30px)]">
          <div className="h-full p-2">
            <div
              className="hover:bg-zinc-800 rounded-[0.75rem] cursor-pointer 
  transition-colors duration-200 p-2"
            >
              <div className="flex justify-between">
                <h1 className="text-zinc-200 font-semibold">Bubble Sort</h1>
                <div className="flex gap-2">
                  <div className="flex gap-2">
                    <Trash className="h-5 w-5 text-red-500 hover:text-red-600 cursor-pointer" />
                    <Pencil className="h-5 w-5 text-indigo-500 hover:text-indigo-600 cursor-pointer" />
                  </div>
                  <p className="text-indigo-500">4:20</p>
                </div>
              </div>
              <p className="text-zinc-200">
                La tecnología ha transformado la vida cotidiana de maneras
                inimaginables hace solo unas décadas. Desde la forma en que nos
              </p>
            </div>
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

        <div style={{ display: isFetching ? "none" : "block" }}>
          <video 
          id="video"
          ref={videoRef} autoPlay={true} />
          <div className="flex justify-between mt-2">
            <h1 className="text-zinc-200 text-2xl font-semibold">
              {currentVideo && currentVideo.video.title}
            </h1>
            <Button variant="outline" className="flex gap-1" size={"sm"}>
              <File className="h-4 w-4" />
              Ver archivos
            </Button>
          </div>
          <p className="text-zinc-400 mt-2">
            {currentVideo && currentVideo.video.description}
          </p>
        </div>

        {foundApps && foundApps.length > 0 && (
            <AlertDialog open={foundApps && foundApps.length > 0}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
The following apps are open
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                  <p>To continue watching the video, you need to close the applications</p>
                    {foundApps.map((app: any) => (
                      <div className="pt-2" key={app.id}>
                        <li
                          className="font-semibold">{app.name}</li>
                      </div>
                    ))}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button 
                  className="flex gap-1 w-[100px]"
                  disabled={loading}
                  onClick={() => killApps(foundApps)}>

                  {loading && (
                    <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                  )}
                    Kill apps
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

            {videos == null && debouncedSearchTerm != "" && (
              <span>No results found for "{debouncedSearchTerm}"</span>
            )}

            {(isLoadingVideos || isLoadingCurrentVideo || isLoading) ? (
              <div className="h-[100px] flex justify-center items-center">
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              </div>
            ) : (
              <>
                {videos &&
                  videos.map((v: any) => (
                    <div
                      onClick={() => {
                        newVideoMutation.mutate(String(v.id));
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
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL}${v.thumbnail}`}
                            alt=""
                            className="w-full"
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
                          <p className="text-sm text-zinc-400">
                            {v.duration} minutes
                          </p>
                          <p className="text-sm text-zinc-400">•</p>
                          <p className="text-sm text-zinc-400">
                            {v.views} views
                          </p>
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
