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
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { plyrOptions } from "@/lib/plyr-options";
import Hls from "hls.js";
import Plyr from "plyr";

export default function VideoDialog({
  title,
  src,
}: {
  title: string;
  src: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    const video = videoRef.current;

    let videoSrc = src;
    const defaultOptions: Plyr.Options = plyrOptions;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        new Plyr(video, defaultOptions);
        video.play().catch((e) => console.error("Error:", e));
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
      video.addEventListener("canplay", () => {
        new Plyr(video, defaultOptions);
        video.play().catch((e) => console.error("Error:", e));
      });
    }
  }, [isOpen, src]);

  return (
    <AlertDialog onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <Button variant="outline" size="icon" className="h-8 gap-1">
          <Eye className="h-5 w-5 text-zinc-200" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-5xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Video for the course {title}.</AlertDialogTitle>
          <AlertDialogDescription>
            <video id="video" ref={videoRef} autoPlay={true} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
