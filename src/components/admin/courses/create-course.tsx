import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "../../../assets/image.png";
import { Rating } from "@mui/material";
import {
  ArrowLeft,
  ChevronLeft,
  Loader,
  Paperclip,
  StarIcon,
  VideoIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse, uploadChunk } from "@/api/courses";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { CHUNK_SIZE } from "@/api/courses";

export default function CreateCourse({ close, invalidate }: { close: () => void, invalidate: () => void }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Creado por ");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [active, setActive] = useState(false);
  const [thumbnail, setThumbnail] = useState<File>();
  const [filePreview, setFilePreview] = useState("");
  const [video, setVideo] = useState<File>();
  const [videoPreview, setVideoPreview] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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

  type CourseData = {
    title: string;
    description: string;
    author: string;
    duration: string;
    is_active: boolean;
    thumbnail: File;
    preview_tmp: string;
  };

  const createCourseMutation = useMutation({
    mutationFn: (courseData: CourseData) => createCourse(courseData),
    onSuccess: () => {
      close();
      invalidate()
      // queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Curso creado con exito.");
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
      if (thumbnail) {
        createCourseMutation.mutate({
          title,
          description,
          author,
          duration,
          is_active: active,
          thumbnail,
          preview_tmp: response,
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
    <div className="container mx-auto">
      <div className="grid grid-cols-2 gap-9">
        <div className="flex items-center justify-center py-9">
          <div className="mx-auto grid w-full max-w-2xl gap-6">
            <p 
            onClick={close}
            className="underline cursor-pointer flex text-zinc-200 mb-6">
              <ChevronLeft />
              <span>Volver atras</span>
            </p>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="last-name">Autor</Label>
                  <Input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    id="last-name"
                    placeholder="Robinson"
                    required
                  />
                </div>
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

              <div className="grid grid-cols-3 gap-4">
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
                    <span className="">Resolucion 1920x1080</span>
                  </Button>
                  <Input
                    ref={inputRef}
                    required
                    onChange={handleFileChange}
                    id="thumbnail"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/svg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={active}
                    onCheckedChange={(active: boolean) => setActive(active)}
                    id="terms"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Estado
                  </label>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="video">Video</Label>
                <Button
                  variant="outline"
                  className="flex justify-start gap-4"
                  onClick={() => videoRef.current?.click()}
                >
                  <Paperclip className="size-4" />
                  <span>Seleccione un video (MP4)</span>
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

              <Button
                disabled={
                  createCourseMutation.isPending ||
                  uploadChunkMutation.isPending
                }
                onClick={detonateChain}
                type="submit"
                className="w-full"
              >
                {createCourseMutation.isPending ||
                uploadChunkMutation.isPending ? (
                  <Loader className="ml-2 h-6 w-6 text-zinc-900 animate-spin slower items-center flex justify-center" />
                ) : (
                  <span>Crear curso</span>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="py-9">
          {video ? (
            <video className="rounded-[0.75rem] h-[100%] w-[100%]" controls>
              <source src={videoPreview} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex justify-center items-center border rounded-[0.75rem]">
              <VideoIcon />
              <p className="text-zinc-200 text-center pl-2">video preview</p>
            </div>
          )}
        </div>
      </div>

      <div className="">
        <div className="bg-zinc-900 rounded-[0.75rem] grid grid-cols-2 min-h-[300px] border">
          {thumbnail ? (
            <img src={filePreview} alt="" className="p-1 rounded-[0.75rem]" />
          ) : (
            <img src={Image} alt="" className="p-1 rounded-[0.75rem]" />
          )}
          <div className="flex flex-col justify-between p-4">
            <div>
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight leading-none text-zinc-200 mb-6">
                {title}
              </h1>

              <p className="max-w-2xl text-zinc-200 mb-4">{author}</p>

              <p className="max-w-2xl text-zinc-200 mb-4">{description}</p>

              <div className="flex gap-2 mb-6">
                <Rating
                  name="text-feedback"
                  value={0}
                  readOnly
                  precision={0.5}
                  size="medium"
                  emptyIcon={
                    <StarIcon className="text-zinc-700" fontSize="inherit" />
                  }
                />
                <p>0.0</p>
                <Link to="/reviews" className="underline">
                  Leer resenas
                </Link>
              </div>

              <p className="max-w-2xl text-muted-foreground mb-6">{duration}</p>
            </div>
            <div className="flex gap-2 mt-auto">
              <Link to={`/video/1`}>
                <Button className="bg-indigo-400 text-black font-semibold hover:bg-indigo-500">
                  Ver curso 1
                </Button>
              </Link>
              <Link to={`/admin/users`}>
                <Button className="bg-indigo-400 text-black font-semibold hover:bg-indigo-500">
                  Ver preview gratuita
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
