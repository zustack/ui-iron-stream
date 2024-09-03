import { getSoloCourse } from "@/api/courses";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Plyr from "plyr";
import Hls from "hls.js";
import { plyrOptions } from "@/lib/plyr-options";

export default function Preview() {
  const { courseId } = useParams()

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["solo-course"],
    queryFn: () => getSoloCourse(Number(courseId)),
  });

  const videoRef = useRef<HTMLMediaElement | null>(null);

  useEffect(() => {
    if (data) {

    let videoSrc = `${import.meta.env.VITE_BACKEND_URL}${data.preview}`;
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
    }

  }, [data]);

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error</p>

  return (
    <div className="flex flex-col gap-4">
    <h1 className="text-3xl font-semibold">{data.title}</h1>
    <h5 className="text-zinc-300">{data.description}</h5>
    <div className="relative">
      <video
        className="player"
        autoPlay={true}
        id="video"
        preload="auto"
      ></video>
    </div>
    </div>
  )
}
