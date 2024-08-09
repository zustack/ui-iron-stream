import { getCurrentVideo, getVideosByCourseId, updateHistory } from "@/api/videos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VideoFeed from "@/components/video-feed";
import VideoHls from "@/components/video-hls";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function Video() {
  const { courseId } = useParams();
  const [resumeState, setResumeState] = useState(0);
  // si no course id mostrar error

  const [count, setCount] = useState(0);

  const updateHistoryMutation = useMutation({
    mutationFn: () => updateHistory(String(video.history_id), String(resumeState)),
  });

  useEffect(() => {
    // Establece un intervalo que se ejecuta cada 1 segundo (1000 ms)
    const intervalId = setInterval(() => {
      updateHistoryMutation.mutate();
      setCount(prevCount => prevCount + 1); // Actualiza el estado
    }, 5000);

    // Limpia el intervalo cuando el componente se desmonte o se actualice
    return () => clearInterval(intervalId);
  }, []); // Dependencias vacías para ejecutar el efecto solo una vez

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

  console.log(video)

  return (
    <div className="grid grid-cols-6 lg:grid-cols-12 gap-4">
      <div className="col-span-6 lg:col-span-8">
        <VideoHls
            setResume={setResumeState}
            resume={video.resume}
            src={video.video.video_hls}
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
