import Plyr from "plyr";
import Hls from "hls.js";
import { useEffect, useRef } from "react";
import { useVideoResumeStore } from "@/store/video-resume";
import { updateHistory } from "@/api/videos";
import { useMutation } from "@tanstack/react-query";
import { appWindow } from "@tauri-apps/api/window";
import { plyrOptions } from "@/lib/plyr-options";

type Props = {
  src: string;
  resume: string;
  setResume: (num: number) => void;
  history_id: string;
  isPaused: boolean;
};

const VideoHls = ({ src, resume, setResume, history_id, isPaused }: Props) => {

  const updateHistoryMutation = useMutation({
    mutationFn: (resumeState: number) =>
      updateHistory(String(history_id), String(resumeState)),
  });

  const videoRef = useRef<HTMLMediaElement | null>(null);
  const { isChangePageRequested, setResume:setResumeZustand, setHistoryId } = useVideoResumeStore();

  useEffect(() => {
    let videoSrc = `${import.meta.env.VITE_BACKEND_URL}${src}`;
    const video = document.getElementById("video") as HTMLMediaElement;
    videoRef.current = video;

    const defaultOptions: Plyr.Options = plyrOptions

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

    if (videoRef.current) {
      videoRef.current.currentTime = Number(resume);
    }

    setHistoryId(history_id)

  }, [resume, src]);

  useEffect(() => {
    if (isChangePageRequested) {
      console.log("historuuuuuu")
      updateHistoryMutation.mutate(videoRef.current.currentTime);
    }
  }, [isChangePageRequested]);

  useEffect(() => {
    if (isPaused) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  }, [isPaused]);

  useEffect(() => {
    if (videoRef.current) {
      setResumeZustand(videoRef.current?.currentTime);
    }
  }, [videoRef.current?.currentTime]);

  setResume(videoRef.current?.currentTime || 0);

  appWindow.listen("tauri://close-requested", async function () {
    // make logout
    if (videoRef.current) {
      updateHistoryMutation.mutate(videoRef.current.currentTime);
    }
  });

  return (
    <div className="relative">
    <p className="text-red-400">{isChangePageRequested  ? "yess" : "nop"}</p>
    <p className="text-red-400">{videoRef.current?.currentTime}</p>
    <p className="text-red-400">Historu: id:  {history_id}</p>
    <button onClick={() => updateHistoryMutation.mutate(videoRef.current.currentTime)}>Save</button>
      <video
        className="player"
        autoPlay={true}
        id="video"
        preload="auto"
      ></video>
    </div>
  );
};

export default VideoHls;
