import { getCurrentVideo, getVideosByCourseId } from "@/api/videos";
import { Button } from "@/components/ui/button";
import VideoFeed from "@/components/video-feed";
import VideoHls from "@/components/video-hls";
import { useOsStore } from "@/store/os";
import { useQuery } from "@tanstack/react-query";
import { Command } from "@tauri-apps/api/shell";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { File, Loader, Pencil, Search, Trash } from "lucide-react";
import { getForbiddenApps } from "@/api/apps";
import VideoNotes from "@/components/video-notes";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

type App = {
  name: string;
  process_name: string;
};

export default function Video() {
  const { courseId } = useParams();
  const [resumeState, setResumeState] = useState(0);

  // start forbidden apps logic
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
    setFoundApps(found);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      getLocalApps();
    }, 1500);
    return () => clearInterval(intervalId);
  }, [foundApps, data]);

  const {
    data: video,
    isLoading: isLoadingCurrentVideo,
    isError: isErrorCurrentVideo,
  } = useQuery({
    queryKey: ["current-video"],
    queryFn: () => getCurrentVideo(courseId || ""),
  });

  const {
    data: videos,
    isLoading: isLoadingVideos,
    isError: isErrorVideos,
  } = useQuery({
    queryKey: ["videos", courseId],
    queryFn: () => getVideosByCourseId(courseId || ""),
  });

  if (isLoadingCurrentVideo) {
    return <div>Loading...</div>;
  }
  if (isLoadingVideos) {
    return <div>Loading...</div>;
  }
  if (isErrorVideos) return <>Error</>;
  if (isErrorCurrentVideo) return <>Error</>;
  if (isLoading) return <p>...</p>;
  if (isError) return <p>Error</p>;

  return (
    <div className="lg:h-[calc(100vh-60px)] flex flex-col lg:flex-row overflow-hidden pt-[10px] px-[10px] gap-[10px] mx-auto">
      {/* Contenedor notas */}
      <div className="flex-1 w-full lg:flex-auto xl:w-[30%]">
        <div className=" h-[140px] flex flex-col justify-between">
          <h1 className="text-zinc-300 text-2xl font-bold">Notes</h1>
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
        <div className="bg-zinc-900 rounded-[0.75rem] mt-[10px] overflow-auto h-[calc(100vh-60px-140px-30px)]">
          <div className="h-full p-2">
            <div className="hover:bg-zinc-800 p-4 rounded-[0.75rem]">
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
                comunicamos hasta cómo trabajamos y nos entretenemos, la
                tecnología ha permeado todos los aspectos de nuestra existencia.
                Los dispositivos móviles, como teléfonos inteligentes y
                tabletas, nos permiten estar conectados en cualquier lugar y en
                cualquier momento, lo que facilita la comunicación instantánea y
                el acceso a la información. Además, el auge de las redes
                sociales ha cambiado la manera en que interactuamos con amigos y
                familiares, creando nuevas formas de relaciones humanas. Sin
                embargo, este avance también ha traído consigo desafíos, como la
                sobrecarga de información, la disminución de la privacidad y el
                aumento de la dependencia de la tecnología
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor central */}
      <div className="flex-1 lg:flex-auto w-full">
        <VideoHls
          setResume={setResumeState}
          resume={video.resume}
          src={video.video.video_hls}
          history_id={video && video.history_id}
          isPaused={foundApps && foundApps.length > 0}
        />
        <div className="flex justify-between mt-2">
          <h1 className="text-zinc-200 text-2xl font-semibold">
            {video.video.title}
          </h1>
          <Button variant="outline" className="flex gap-1" size={"sm"}>
            <File className="h-4 w-4" />
            Ver archivos
          </Button>
        </div>
        <p className="text-zinc-400 mt-2">{video.video.description}</p>
      </div>

      {/* Contenedor playlist */}
      <div className="flex-1 w-full lg:flex-auto xl:w-[30%]">
        <form className="ml-auto flex-1 sm:flex-initial h-[50px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Busca un video..."
              className="pl-8 w-full"
            />
          </div>
        </form>

        <div className="overflow-auto h-[calc(100vh-60px-50px-20px)]">
          <div className="h-full">
            <div
              className={`
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
                    src="https://framerusercontent.com/images/WR98JzQivDxO6VDNu8E39vrsqg.png"
                    alt=""
                    className="w-full"
                  />
                  <div
                    className={`absolute 
                    bottom-0 left-0 
                    h-[6px] bg-indigo-600 rounded-b-[0.75rem]`}
                  ></div>
                </div>
              </div>
              <div className="flex-col mx-2">
                <h4 className="font-semibold mt-2">Title</h4>
                <p className="text-sm text-zinc-200 mt-2">
                  Descriptionkasnfsdkl
                </p>
                <div className="flex gap-2 mt-2">
                  <p className="text-sm text-zinc-400">35 minutes</p>
                  <p className="text-sm text-zinc-400">•</p>
                  <p className="text-sm text-zinc-400">1287 views</p>
                </div>
              </div>
            </div>
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
