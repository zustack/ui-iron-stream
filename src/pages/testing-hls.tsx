import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import { plyrOptions } from "@/lib/plyr-options";
import "./TestingHls.css"; // Asegúrate de importar el archivo CSS

const TestingHls: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState(
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  );

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      let hls: Hls | null = null;
      let plyrInstance: Plyr | null = null;

      if (!isLoading && video) {
        const videoSrc = playlist;
        const defaultOptions: Plyr.Options = plyrOptions;

        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(videoSrc);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            plyrInstance = new Plyr(video, defaultOptions);
            video.play().catch((e) => console.error("Error playing video:", e));
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = videoSrc;
          video.addEventListener("canplay", () => {
            plyrInstance = new Plyr(video, defaultOptions);
            video.play().catch((e) => console.error("Error playing video:", e));
          });
        }
      }
    }
  }, [playlist]);

  return (
    <div className="">
      <p>{isLoading ? "Loading..." : "Ready"}</p>
      {isLoading && "hey"}
      <button onClick={() => {
        setIsLoading(!isLoading)
        console.log("is loading", isLoading)
      }}>change state</button>
      <video ref={videoRef} 
      style={{display: isLoading ? "none" : "block"}}
      className={`${isLoading ? "hidden" : "block"}`} />
    </div>
  );
};

export default TestingHls;
