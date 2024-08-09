import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "../../../assets/image.png";
import { Rating } from "@mui/material";
import {
  ChevronLeft,
  Loader,
  Paperclip,
  PlusCircle,
  StarIcon,
  VideoIcon,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, ChangeEvent, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { createCourse, uploadChunk } from "@/api/courses";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { CHUNK_SIZE } from "@/api/courses";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createVideo } from "@/api/videos";

export default function CreateVideo({
  invalidate,
}: {
  invalidate: () => void;
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Creado por ");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [active, setActive] = useState(false);
  const [thumbnail, setThumbnail] = useState<File>();
  const [filePreview, setFilePreview] = useState("");
  const [video, setVideo] = useState<File>();
  const [videoPreview, setVideoPreview] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const { courseId } = useParams()

  const [is, setIs] = useState(false);

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setVideo(file);
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
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
    onSuccess: () => {
      invalidate();
      setIs(false);
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
      toast.error(error.response?.data?.error || "Ocurrió un error inesperado");
    },
  });

  function detonateChain() {
    if (video) {
      uploadChunkMutation.mutate(video);
    } else {
      toast.error("Por favor, selecciona un video");
    }
  }

  return (
    <AlertDialog onOpenChange={(is: boolean) => setIs(is)} open={is}>
      <AlertDialogTrigger>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Crear video
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Crea un nuevo video dentro del curso (x)
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
              createVideoMutation.isPending || uploadChunkMutation.isPending
            }
            onClick={detonateChain}
          >
            {createVideoMutation.isPending || uploadChunkMutation.isPending ? (
              <Loader className="h-6 w-6 text-zinc-900 animate-spin slower items-center flex justify-center" />
            ) : (
              <span>Crear curso</span>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
