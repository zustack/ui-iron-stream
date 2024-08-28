import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileImage, Loader, PlusCircle, Video } from "lucide-react";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useState, ChangeEvent, useRef } from "react";
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
import { createVideo } from "@/api/videos";

export default function CreateVideo() {
  const queryClient = useQueryClient();
  const { courseId, courseTitle } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [thumbnail, setThumbnail] = useState<File>();
  const [video, setVideo] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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
    title: string;
    description: string;
    course_id: string;
    duration: string;
    thumbnail: File;
    video_tmp: string;
  };

  const createVideoMutation = useMutation({
    mutationFn: (videoPayload: VideoPayload) => createVideo(videoPayload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      setIsOpen(false);
      setTitle("");
      setDescription("");
      setDuration("");
      setThumbnail(undefined);
      setVideo(undefined);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data?.error || "An unexpected error occurred.");
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
      if (thumbnail && courseId) {
        createVideoMutation.mutate({
          title,
          description,
          course_id: courseId,
          duration,
          thumbnail,
          video_tmp: response,
        });
      }
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data?.error || "An unexpected error occurred.");
    },
  });

  function detonateChain() {
    if (video) {
      if (!thumbnail) {
        toast.error("The thumbnail is required");
        return;
      }
      uploadChunkMutation.mutate(video);
    } else {
      toast.error("The video is required");
      return;
    }
  }

  return (
    <AlertDialog
      onOpenChange={(open: boolean) => setIsOpen(open)}
      open={isOpen}
    >
      <AlertDialogTrigger>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create video
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Create video for the course {courseTitle}.
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
            createVideoMutation.isPending || uploadChunkMutation.isPending
          }
          >Cerrar</AlertDialogCancel>
          <Button
            className="flex gap-2"
            disabled={
              createVideoMutation.isPending ||
              uploadChunkMutation.isPending
            }
            onClick={detonateChain}
          >
              <span>
              Create video
              </span>
              {(createVideoMutation.isPending || uploadChunkMutation.isPending) && (
                <Loader className="h-6 w-6 text-zinc-900 animate-spin slower items-center flex justify-center" />
              )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
