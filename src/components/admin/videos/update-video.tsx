import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileImage, Loader, Pencil, Video } from "lucide-react";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useState, ChangeEvent, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadChunk } from "@/api/courses";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { CHUNK_SIZE } from "@/api/courses";
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
import { updateVideo } from "@/api/videos";

type VideoProp = {
  id: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  video_hls: string;
};

export default function UpdateVideo({ data }: { data: VideoProp }) {
  const queryClient = useQueryClient();
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [thumbnail, setThumbnail] = useState<File>();
  const [video, setVideo] = useState<File>();
  const [oldThumbnail, setOldThumbnail] = useState("");
  const [oldVideo, setOldVideo] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTitle(data.title);
    setDescription(data.description);
    setDuration(data.duration);
    setOldThumbnail(data.thumbnail);
    setOldVideo(data.video_hls);
  }, [data]);

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setVideo(file);
    }
  };

  type VideoPayload = {
    id: number;
    title: string;
    description: string;
    course_id: string;
    duration: string;
    thumbnail?: File;
    video_tmp: string;
    old_thumbnail: string;
    old_video: string;
  };

  const updateVideoMutation = useMutation({
    mutationFn: (videoPayload: VideoPayload) => updateVideo(videoPayload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      setIsOpen(false);
      setThumbnail(undefined);
      setVideo(undefined);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data?.error || "Ocurrió un error inesperado");
    },
  });

  const uploadChunkMutation = useMutation({
    mutationFn: async (file: File) => {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let finalResponse;
      const uuid = crypto.randomUUID();
      for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
        finalResponse = await uploadChunk({
          file,
          chunkNumber,
          totalChunks,
          uuid,
        });
      }
      return finalResponse;
    },
    onSuccess: (response) => {
      updateVideoMutation.mutate({
        id: data.id,
        title,
        description,
        course_id: courseId || "",
        duration,
        thumbnail,
        video_tmp: response,
        old_thumbnail: oldThumbnail,
        old_video: oldVideo,
      });
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data?.error || "Ocurrió un error inesperado");
    },
  });

  function detonateChain() {
    if (video) {
      uploadChunkMutation.mutate(video);
    } else {
      updateVideoMutation.mutate({
        id: data.id,
        title,
        description,
        course_id: courseId || "",
        duration,
        thumbnail,
        video_tmp: "",
        old_thumbnail: oldThumbnail,
        old_video: oldVideo,
      });
    }
  }

  return (
    <AlertDialog
      onOpenChange={(open: boolean) => setIsOpen(open)}
      open={isOpen}
    >
      <AlertDialogTrigger>
        <Button variant="outline" size="icon" className="h-8 gap-1 mx-1">
          <Pencil className="h-5 w-5 text-indigo-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Update the video {data.title}.
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="">
              <div className="flex items-center justify-center p-2">
                <div className="mx-auto grid w-full max-w-md gap-6">
                  <div className="mx-auto grid w-full max-w-2xl gap-6">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Title"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          id="desctiption"
                          rows={5}
                          placeholder="Description"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="Duration"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="thumbnail">Thumbnail</Label>
                        <Button
                          id="thumbnail"
                          onClick={() => inputRef.current?.click()}
                          variant="outline"
                          className="flex justify-start gap-4"
                        >
                          <FileImage className="size-4" />
                          <span>
                            {thumbnail?.name ? (
                              <>{thumbnail?.name.slice(0, 40)}</>
                            ) : (
                              <>
                                Recomended aspect ratio 16:9 (PNG, JPG, JPEG,
                                SVG)
                              </>
                            )}
                          </span>
                        </Button>
                        <Input
                          ref={inputRef}
                          required
                          onChange={handleThumbnailChange}
                          id="thumbnail"
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpg, image/jpeg, image/svg"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="video">Video</Label>
                        <Button
                          variant="outline"
                          className="flex justify-start gap-4"
                          onClick={() => videoRef.current?.click()}
                        >
                          <Video className="size-4" />
                          <span>
                            {video?.name ? (
                              <>{video?.name.slice(0, 40)}</>
                            ) : (
                              <>Recomended aspect ratio 16:9 (MP4, MOV, MKV)</>
                            )}
                          </span>
                        </Button>
                        <Input
                          ref={videoRef}
                          required
                          onChange={handleVideoChange}
                          id="video"
                          type="file"
                          accept="video/mp4,video/mov,video/mkv"
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
          disabled={
            updateVideoMutation.isPending || uploadChunkMutation.isPending
          }
          >Cerrar</AlertDialogCancel>
          <Button
            className="flex gap-2"
            disabled={
              updateVideoMutation.isPending || uploadChunkMutation.isPending
            }
            onClick={detonateChain}
          >
            <span>Update video</span>
            {(updateVideoMutation.isPending ||
              uploadChunkMutation.isPending) && (
              <Loader className="h-6 w-6 text-zinc-900 animate-spin slower items-center flex justify-center" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
