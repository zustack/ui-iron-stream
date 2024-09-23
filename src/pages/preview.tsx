import { getSoloCourse } from "@/api/courses";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Plyr from "plyr";
import Hls from "hls.js";
import { plyrOptions } from "@/lib/plyr-options";
import { Skeleton } from "@mui/material";

export default function Preview() {
  const { courseId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["solo-course"],
    queryFn: () => getSoloCourse(Number(courseId)),
  });

  useEffect(() => {
    if (data) {
      const video = videoRef.current;
      if (!video) return;

      let videoSrc = `${import.meta.env.VITE_BACKEND_URL}${data.preview}`;
      const defaultOptions: Plyr.Options = plyrOptions;

      if (Hls.isSupported()) {
        const hls = new Hls({});

        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          new Plyr(video, defaultOptions);
          video.play().catch((e) => console.error("Error al reproducir:", e));
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
        video.addEventListener("canplay", () => {
          new Plyr(video, defaultOptions);
          video.play().catch((e) => console.error("Error al reproducir:", e));
        });
      }
    }
  }, [data]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-4">
        {isLoading && (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[660px] w-[1173px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[400px]" />
            </div>
          </div>
        )}

        {isError && (
          <div className="h-[660px] w-[1173px] flex justify-center items-center rounded-xl bg-zinc-900">
            <p>Error while loading</p>
          </div>
        )}

        <div style={{ display: isLoading ? "none" : "block" }}>
          <h1 className="text-3xl mt-[10px]">{data?.title}</h1>
          <h5 className="text-zinc-300 mt-[5px]">{data?.description}</h5>
          <div className="relative mt-[5px]">
            <video id="video-player-preview" ref={videoRef} autoPlay={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
