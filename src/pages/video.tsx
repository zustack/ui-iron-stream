import { getCurrentVideo, getVideosByCourseId, updateHistory } from "@/api/videos";
import { Button } from "@/components/ui/button";
import VideoFeed from "@/components/video-feed";
import VideoHls from "@/components/video-hls";
import { useMutation, useQuery } from "@tanstack/react-query";
import { appWindow } from "@tauri-apps/api/window";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Video() {
  const { courseId } = useParams();
  const [resumeState, setResumeState] = useState(0);

  // poner todo esto en video-hls
  const updateHistoryMutation = useMutation({
    mutationFn: () => updateHistory(String(video.history_id), String(resumeState)),
  });

    /*
      isChangePageRequested: boolean
      changePage:() => void;
    */

  // el usuario le dio click a otra pagina?
  // cambiar changePageRequested(true)
  // en el useEffect poner la dependecia de changePageRequested para capturar el evento(resume time)
  // 

  appWindow.listen("tauri://close-requested", async function () {
    // make logout
    updateHistoryMutation.mutate();
  });
  // end video-hls

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

  if (isLoadingCurrentVideo ){
    return <div>Loading...</div>;
  }
if (isLoadingVideos) {
  return <div>Loading...</div>;
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

        <p className="text-zinc-400 mt-2">
            {video.video.description}
        </p>
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
