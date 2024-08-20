import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Plyr from "plyr";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";

export default function VideoHls({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    const videoElement = videoRef.current;

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
      hls.loadSource(src);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const availableQualities = hls.levels.map((level) => level.height);
        defaultOptions.quality!.options = availableQualities;

        const index1080p = hls.levels.findIndex(
          (level) => level.height === 1080
        );

        if (index1080p !== -1) {
          hls.currentLevel = index1080p;
        }

        new Plyr(videoElement, defaultOptions);
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", event, data);
      });
      (window as any).hls = hls;
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = src;
      new Plyr(videoElement, defaultOptions);
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
  }, [isOpen, src]);

  return (
    <AlertDialog onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <Button size="sm" className="h-8 gap-1">
        <Eye className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent forceMount={true} className="max-w-5xl">
        <AlertDialogTitle>Video HLS</AlertDialogTitle>
        <AlertDialogHeader>
          <video
            ref={videoRef}
            className="player"
            autoPlay={false}
            id="video-hls-foo"
            preload="auto"
          ></video>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
