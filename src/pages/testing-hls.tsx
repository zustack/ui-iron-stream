import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import { plyrOptions } from "@/lib/plyr-options";

const TestingHls: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoSrc = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
    const defaultOptions: Plyr.Options = plyrOptions

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        new Plyr(video, defaultOptions);
        video.play().catch((e) => console.error("Error al reproducir:", e));
      });
    }
    // Para navegadores que soporten HLS nativamente como Safari
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
      video.addEventListener("canplay", () => {
        new Plyr(video, defaultOptions);
        video.play().catch((e) => console.error("Error al reproducir:", e));
      });
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

 return (
    <div className="custom-video-container">
      <video ref={videoRef} className="custom-video-player" />
      <div className="custom-controls">
        <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        {/* Añade más controles personalizados aquí */}
      </div>
    </div>
  );
};

export default TestingHls;
