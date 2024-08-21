import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader,
  Paperclip,
  Pencil,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useState, ChangeEvent, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
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

export default function UpdateVideo({
  invalidate,
  data,
  isLoading,
}: {
  invalidate: () => void;
  data: VideoProp;
  isLoading: boolean
}) {

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

  useEffect(() => {
    if (!isLoading) {
      setIsOpen(false);
      setThumbnail(undefined);
      setVideo(undefined);
      // setOldThumbnail("");
      // setOldVideo("");
    }
  }, [isLoading]);

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
    thumbnail: File;
    video_tmp: string;
    old_thumbnail: string;
    old_video: string;
  };

  const updateVideoMutation = useMutation({
    mutationFn: (videoPayload: VideoPayload) => updateVideo(videoPayload),
    onSuccess: () => {
      invalidate();
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
          course_id: courseId,
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
        course_id: courseId,
        duration,
        thumbnail,
        video_tmp: "",
        old_thumbnail: oldThumbnail,
        old_video: oldVideo,
      })
      console.log(oldThumbnail)
      console.log(oldVideo)
    }
  }

  return (
    <AlertDialog onOpenChange={(open: boolean) => setIsOpen(open)} open={isOpen}>
      <AlertDialogTrigger>
        <Button variant="outline" size="icon" className="h-8 gap-1 mx-1">
          <Pencil className="h-5 w-5 text-indigo-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Actualiza el video {data.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="">
              <div className="flex items-center justify-center p-2">
                <div className="mx-auto grid w-full max-w-md gap-6">
                  <div className="mx-auto grid w-full max-w-2xl gap-6">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="first-name">Titulo</Label>
                        <Input
                          id="first-name"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Titulo"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">Descripción</Label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          id="email"
                          rows={5}
                          placeholder="Descripcion"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="last-name">Duracion</Label>
                        <Input
                          id="last-name"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="Duracion"
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
                          <Paperclip className="size-4" />
                          <span className="">
                            Resolucion 1920x1080
                            {thumbnail?.name}
                          </span>
                        </Button>
                        <Input
                          ref={inputRef}
                          required
                          onChange={handleThumbnailChange}
                          id="thumbnail"
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg, image/svg"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="video">Video</Label>
                        <Button
                          variant="outline"
                          className="flex justify-start gap-4"
                          onClick={() => videoRef.current?.click()}
                        >
                          <Paperclip className="size-4" />
                          <span>
                            Seleccione un video (MP4)
                            {video?.name}
                          </span>
                        </Button>
                        <Input
                          ref={videoRef}
                          required
                          onChange={handleVideoChange}
                          id="video"
                          type="file"
                          accept="video/mp4"
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
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          <Button
            className="w-[100px]"
            disabled={
              updateVideoMutation.isPending || uploadChunkMutation.isPending || isLoading
            }
            onClick={detonateChain}
          >
            {updateVideoMutation.isPending || uploadChunkMutation.isPending || isLoading ? (
              <Loader className="h-6 w-6 text-zinc-900 animate-spin slower items-center flex justify-center" />
            ) : (
              <span>Actualizar</span>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
