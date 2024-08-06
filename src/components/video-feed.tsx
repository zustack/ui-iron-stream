import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "../assets/image.png";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { newVideo } from "@/api/videos";

export default function VideoFeed({
  videos,
  resume,
  history_id,
  current_video_id,
}: any) {
  const { courseId } = useParams();

  const queryClient = useQueryClient();

  const newVideoMutation = useMutation({
    mutationFn: (video_id: string) =>
      newVideo(String(history_id), video_id, courseId || "", String(resume), current_video_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-video"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: (response) => {
      //@ts-ignore
      toast.error(response.response.data.error);
    },
  });

  return (
    <>
      <form className="ml-auto flex-1 sm:flex-initial mb-4 mr-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Busca un video..."
            className="pl-8 w-full"
          />
        </div>
      </form>
      <ScrollArea className="h-[715px] w-full pr-4">
        {videos.data &&
          videos.data.map((v: any) => (
            <div
              onClick={() => newVideoMutation.mutate(String(v.id))}
              className="mb-2 p-1 hover:bg-zinc-800 rounded-[0.75rem] cursor-pointer 
        transition-colors duration-200 border-indigo-600"
            >
              <div className="relative">
                <div
                  className={
                    v.id === current_video_id
                      ? "relative overflow-hidden rounded-[0.75rem] border-[1px] border-indigo-600/50"
                      : "relative overflow-hidden rounded-[0.75rem]"
                  }
                >
                  <img src={Image} alt="" className="w-full" />
                  <div 
                  style={{width: `${v.video_resume}%`}}
                  className={`absolute 
                    bottom-0 left-0 
                    h-[6px] bg-indigo-600 rounded-b-[0.75rem]`}></div>
                </div>
              </div>
              <div className="flex-col mx-2">
                <h4 className="font-semibold mt-2">{v.title}</h4>
                <p className="text-sm text-zinc-200 mt-2">
                  {v.description}
                  {v.id === current_video_id && (
                    <span className="text-indigo-600"> (playing)</span>
                  )}
                </p>
                <div className="flex gap-2 mt-2">
                  <p className="text-sm text-zinc-400">{v.length}</p>
                  <p className="text-sm text-zinc-400">•</p>
                  <p className="text-sm text-zinc-400">{v.views} views</p>
                </div>
              </div>
            </div>
          ))}
      </ScrollArea>
    </>
  );
}
