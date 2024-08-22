import {
  getCurrentVideo,
  getVideosByCourseId,
} from "@/api/videos";
import { Button } from "@/components/ui/button";
import VideoFeed from "@/components/video-feed";
import VideoHls from "@/components/video-hls";
import { useOsStore } from "@/store/os";
import { useQuery } from "@tanstack/react-query";
import { Command } from "@tauri-apps/api/shell";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { getForbiddenApps } from "@/api/apps";

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

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
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

  console.log("data", data)
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

  console.log("found", foundApps)


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
  if (isLoading) return <p>...</p>
  if (isError) return <p>Error</p>

  return (
    <div className="grid grid-cols-6 lg:grid-cols-12 gap-4">
      <div className="col-span-6 lg:col-span-8">
        <VideoHls
          setResume={setResumeState}
          resume={video.resume}
          src={video.video.video_hls}
          history_id={video && video.history_id}
          isPaused={foundApps && foundApps.length > 0 }
        />
        <h1 className="text-zinc-200 mt-4 text-xl font-semibold">
          {video.video.title}
        </h1>

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
              <Button onClick={() => killApps(foundApps, "linux")}>Kill</Button>
            )}
          </p>
          </div>
        )}

        <p className="text-zinc-400 mt-2">{video.video.description}</p>
        <div className="mt-2 flex gap-2">
          <Button>Ver archivos</Button>
          <Button>Abrir notas</Button>
        </div>
      </div>
      <div className="col-span-6 lg:col-span-4">
        <VideoFeed
          history_id={video && video.history_id}
          resume={resumeState}
          videos={videos}
          current_video_id={video.video.id}
        />
      </div>
    </div>
  );
}

/*
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
