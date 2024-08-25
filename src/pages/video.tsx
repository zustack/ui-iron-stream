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

type App = {
  name: string;
  process_name: string;
};

export default function Video() {
  const { courseId } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const videoRef = useRef<HTMLMediaElement | null>(null);
  const queryClient = useQueryClient();
  const [currentVideoId, setCurrentVideoId] = useState(0)

  // la logica para forbidden apps
  const [foundApps, setFoundApps] = useState<App[]>([]);
  const { os } = useOsStore();
  const [loading, setLoading] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["fobidden-apps"],
    queryFn: () => getForbiddenApps(),
  });

  async function killApps(apps: App[], os: string) {
    setLoading(true);
    for (const app of apps) {
      const command = new Command("kill-linux", [app.process_name]);
      await command.execute();
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
  // end logica para forbidden apps

  // obten el video que estaba viendo el usuario
  const {
    data: currentVideo,
    isLoading: isLoadingCurrentVideo,
    isFetching,
    isError: isErrorCurrentVideo,
  } = useQuery({
    queryKey: ["current-video"],
    queryFn: () => getCurrentVideo(courseId || ""),
  });

  useEffect(() => {
    if (
      !isLoadingCurrentVideo &&
      !isErrorCurrentVideo &&
      currentVideo &&
      currentVideo.video
    ) {
      // se esta ejecutando 2 veces!!!!!
      let videoSrc = `${import.meta.env.VITE_BACKEND_URL}${currentVideo.video.video_hls}`;
      // const videoSrc = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
      const video = document.getElementById("video") as HTMLVideoElement;
      console.log("ehheheh");

      videoRef.current = video;

      if (videoRef.current) {
        const defaultOptions: Plyr.Options = plyrOptions;

        if (Hls.isSupported()) {
          const hls = new Hls({
            startLevel: -1,
            capLevelToPlayerSize: true,
          });

          hls.loadSource(videoSrc);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, function (_event, _data) {
            const availableQualities = hls.levels.map((level) => level.height);
            defaultOptions.quality!.options = availableQualities;

            // Find the index of the 1080p quality
            const index1080p = hls.levels.findIndex(
              (level) => level.height === 1080
            );

            if (index1080p !== -1) {
              hls.currentLevel = index1080p;
            }
            new Plyr(video, defaultOptions);
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // For browsers that support HLS natively (e.g. Safari)
          video.src = videoSrc;
          new Plyr(video, defaultOptions);
        } else {
          console.error("This browser doesn't support HLS");
        }

        localStorage.setItem("historyId", currentVideo.history_id);

        // scroll al video(en caso de que halla muchos :D
        const element = document.getElementById(currentVideo.video.id);
        if (element) {
          element.scrollIntoView();
        }
      }
    }
  }, [currentVideo && currentVideo.video && currentVideo.video.video_hls]);

  // obten el video feed
  const {
    data: videos,
    isLoading: isLoadingVideos,
    isFetching: isFetchingVideos,
    isError: isErrorVideos,
  } = useQuery({
    queryKey: ["videos", debouncedSearchTerm],
    queryFn: () => getVideosByCourseId(courseId || "", debouncedSearchTerm),
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
      console.log("error error error error", response);
    },
  });

  console.log("IS FETCHING", isFetching);

  if (isErrorVideos) return <>Error</>;
  if (isErrorCurrentVideo) return <>Error</>;
  if (isError) return <p>Error</p>;
  /*

    */

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
        {isFetching && (
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
            style={{ display: isFetching ? "none" : "block" }}
            className="player"
            autoPlay={true}
            id="video"
            preload="auto"
          ></video>
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
          <div className="z-10 fixed top-0 left-0 bg-zinc-900/80 backdrop-blur-lg w-full h-full flex justify-center items-center">
            <p className="text-zinc-400 mt-2">
              {foundApps.map((app: any) => (
                <ul>
                  <li className="text-red-500">{app.name}</li>
                </ul>
              ))}
              {loading ? (
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              ) : (
                <Button onClick={() => killApps(foundApps, "linux")}>
                  Kill
                </Button>
              )}
            </p>
          </div>
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

            {isLoadingVideos || isLoadingCurrentVideo ? (
              <div className="h-[100px] flex justify-center items-center">
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              </div>
            ) : (
              <>
                {videos &&
                  videos.map((v: any) => (
                    <div
                      onClick={() => {
                        newVideoMutation.mutate(String(v.id))
                        setCurrentVideoId(v.id)
                      }}
                      id={v.id}
                      className={`${(currentVideoId === 0 && v.id === currentVideo.video.id)
                        || v.id === currentVideoId ? "bg-zinc-800" : ""}
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

/*

      <div className="grid grid-cols-12 gap-4 px-4 h-auto">
        <div className="col-span-3">
          <VideoNotes />
        </div>

        <div className="col-span-6">
          <VideoHls
            setResume={setResumeState}
            resume={video.resume}
            src={video.video.video_hls}
            history_id={video && video.history_id}
            isPaused={foundApps && foundApps.length > 0}
          />
          <h1 className="text-zinc-200 mt-4 text-xl font-semibold">
            {video.video.title}
          </h1>

          <p className="text-zinc-400 mt-2">{video.video.description}</p>
          <div className="mt-2 flex gap-2">
            <Button>Ver archivos</Button>
            <Button>Abrir notas</Button>
          </div>

          {foundApps && foundApps.length > 0 && (
            <div className="z-10 fixed top-0 left-0 bg-zinc-900/80 backdrop-blur-lg w-full h-full flex justify-center items-center">
              <p className="text-zinc-400 mt-2">
                {foundApps.map((app: any) => (
                  <ul>
                    <li className="text-red-500">{app.name}</li>
                  </ul>
                ))}
                {loading ? (
                  <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                ) : (
                  <Button onClick={() => killApps(foundApps, "linux")}>
                    Kill
                  </Button>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="col-span-3">
          <VideoFeed
            history_id={video && video.history_id}
            resume={resumeState}
            videos={videos}
            current_video_id={video.video.id}
          />
        </div>
      </div>
  *
  *
  *
function viewFiles() {
  const webview = new WebviewWindow('theUniqueLabel', {
    url: 'notes',
  })
  // since the webview window is created asynchronously,
  // Tauri emits the `tauri://created` and `tauri://error` to notify you of the creation response
  webview.once('tauri://created', function () {
    // webview window successfully created
  })
  webview.once('tauri://error', function (e) {
    // an error occurred during webview window creation
  })
}
*/
