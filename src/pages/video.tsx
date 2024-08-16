import { getForbiddenApps } from "@/api/apps";
import {
  getCurrentVideo,
  getVideosByCourseId,
  updateHistory,
} from "@/api/videos";
import ForbiddenApps from "@/components/forbidden-apps";
import { Button } from "@/components/ui/button";
import VideoFeed from "@/components/video-feed";
import VideoHls from "@/components/video-hls";
import { useOsStore } from "@/store/os";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Command } from "@tauri-apps/api/shell";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type App = {
  name: string;
  process_name: string;
};

export default function Video() {
  const { courseId } = useParams();
  const [resumeState, setResumeState] = useState(0);


  // start forbidden apps logic
  const [localApps, setLocalApps] = useState("");
  const [foundApps, setFoundApps] = useState<App[]>([]);
  const { os } = useOsStore()

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
    const data = output.stdout;
    setLocalApps(data);
  }

  // query to get remote apps 
  // this endpoint should check if the user.isSepcialApps is true
  // if true, it should return the special apps by user_id
  // if not true, it should return the normal apps by os!!
  const {
    data: forbiddenApps,
    isLoading: isLoadingForbiddenApps,
    isError: isErrorForbiddenApps,
  } = useQuery({
    queryKey: ["forbidden-apps"],
    queryFn: () => getForbiddenApps(),
  });

    console.log(forbiddenApps)
    console.log("local apps", localApps)
    console.log("found apps", foundApps)

  const findAndStoreApps = () => {
    if (!forbiddenApps || !localApps) return;
    const found = forbiddenApps.filter((item: App) =>
      localApps.includes(item.process_name)
    );
    setFoundApps(found);
  };

  useEffect(() => {
      const intervalId = setInterval(() => {
        getLocalApps();
        findAndStoreApps();
      }, 5000);
      return () => clearInterval(intervalId);
  }, [localApps, foundApps, forbiddenApps]);
  // end forbidden apps logic

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

  if (foundApps && foundApps.length > 0) {
    return (
      <ForbiddenApps apps={foundApps}/>
    )
  }

  if (isErrorVideos) return <>Error</>;
  if (isErrorCurrentVideo) return <>Error</>;

  return (
    <div className="grid grid-cols-6 lg:grid-cols-12 gap-4">
      <div className="col-span-6 lg:col-span-8">
        <VideoHls
          setResume={setResumeState}
          resume={video.resume}
          src={video.video.video_hls}
          history_id={video && video.history_id}
        />
        <h1 className="text-zinc-200 mt-4 text-xl font-semibold">
          {video.video.title}
        </h1>

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
