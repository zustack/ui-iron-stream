import Plyr from "plyr";
import Hls from "hls.js";
import { useEffect, useRef } from "react";
import { Button } from "@mui/material";

type Props = {
  src: string;
  resume: string;
  setResume: (num: number) => void;
};

const VideoHls = ({ src, resume, setResume }: Props) => {
  const videoRef = useRef<HTMLMediaElement | null>(null);

  useEffect(() => {
    let videoSrc = `${import.meta.env.VITE_BACKEND_URL}${src}`;
    const video = document.getElementById("video") as HTMLMediaElement;
    videoRef.current = video;

    const defaultOptions: Plyr.Options = {
      controls: [
        "play-large",
        "restart",
        "rewind",
        "play",
        "fast-forward",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "captions",
        "settings",
        "fullscreen",
      ],
      settings: ["captions", "quality", "speed"],
      i18n: {
        restart: "Restart",
        rewind: "Rewind {seektime}s",
        play: "Play",
        pause: "Pause",
        fastForward: "Forward {seektime}s",
        seek: "Seek",
        seekLabel: "{currentTime} of {duration}",
        played: "Played",
        buffered: "Buffered",
        currentTime: "Current time",
        duration: "Duration",
        volume: "Volume",
        mute: "Mute",
        unmute: "Unmute",
        enableCaptions: "Enable captions",
        disableCaptions: "Disable captions",
        download: "Download",
        enterFullscreen: "Enter fullscreen",
        exitFullscreen: "Exit fullscreen",
        frameTitle: "Player for {title}",
        captions: "Captions",
        settings: "Settings",
        pip: "PIP",
        menuBack: "Go back to previous menu",
        speed: "Velocidad",
        normal: "Normal",
        quality: "Calidad",
        loop: "Loop",
        start: "Start",
        end: "End",
        all: "All",
        reset: "Reset",
        disabled: "Disabled",
        enabled: "Enabled",
        advertisement: "Ad",
        qualityBadge: {
          2160: "4K",
          1440: "HD",
          1080: "HD",
          720: "HD",
          576: "SD",
          480: "SD",
          360: "SD",
        },
      },
      quality: {
        default: 1080,
        options: [1080, 720, 480, 360],
        forced: true,
        onChange: (newQuality: number) => updateQuality(newQuality),
      },
    };

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
      hls.on(Hls.Events.ERROR, function (event, data) {
        console.error("HLS error:", event, data);
      });
      (window as any).hls = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For browsers that support HLS natively (e.g. Safari)
      video.src = videoSrc;
      new Plyr(video, defaultOptions);
    } else {
      console.error("This browser doesn't support HLS");
    }

    function updateQuality(newQuality: number) {
      if ((window as any).hls) {
        const levelIndex = (window as any).hls.levels.findIndex(
          (level: any) => level.height === newQuality
        );
        if (levelIndex !== -1) {
          (window as any).hls.currentLevel = levelIndex;
        }
      }
    }

    if (videoRef.current) {
      videoRef.current.currentTime = Number(resume);
    }
  }, [resume, src]);

const handleResume = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Number(resume);
    }
  };

  setResume(videoRef.current?.currentTime || 0);

  return (
    <>
      <div className="relative">
        <video
          className="player"
          autoPlay={false}
          id="video"
          preload="auto"
        ></video>
 {videoRef.current?.currentTime}
      <Button onClick={handleResume}>Resume video</Button>
      </div>
      <div></div>
    </>
  );
};

export default VideoHls;
