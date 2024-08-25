import Plyr from "plyr";
import Hls from "hls.js";
import { useEffect, useRef } from "react";
import { updateHistory } from "@/api/videos";
import { useMutation } from "@tanstack/react-query";
import { appWindow } from "@tauri-apps/api/window";
import { plyrOptions } from "@/lib/plyr-options";

type Props = {
  src: string;
  resume: string;
  history_id: string;
  isPaused: boolean;
};

const VideoHls = ({ src, resume, history_id, isPaused }: Props) => {

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

    localStorage.setItem('historyId', history_id);
    // setHistoryId(history_id)

  }, [resume, src]);

  useEffect(() => {
    if (isPaused) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  }, [isPaused]);

  return (
    <div 
    className="relative">
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
