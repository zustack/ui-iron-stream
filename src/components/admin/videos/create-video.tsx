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
  StarIcon,
  VideoIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
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

export default function CreateVideo({
  close,
  invalidate,
}: {
  close: () => void;
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
      invalidate();
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
      <div className="grid grid-cols-1 gap-9">
        <div className="">
          <div className="">
            <div className="grid grid-cols-6 my-6 items-center">
              <p
                onClick={close}
                className="underline cursor-pointer flex text-zinc-200 col-span-2"
              >
                <ChevronLeft />
                <span>Volver atras</span>
              </p>

              <h1 className="text-3xl font-bold text-center col-span-2">
                Crear nuevo video
              </h1>
            </div>
            <div className="grid gap-6">
              <Card className="bg-background mb-4">
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 pt-4">
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
                      <Label htmlFor="thumbnail-video">Thumbnail</Label>
                      <div>
                      <Button
                        onClick={() => inputRef.current?.click()}
                        variant="outline"
                        id="thumbnail-video"
                        className="flex w-full gap-4 justify-start"
                      >
                        <Paperclip className="size-4" />
                        <span>png, jpeg, svg</span>
                      </Button>
                      <Input
                        ref={inputRef}
                        required
                        onChange={handleFileChange}
                        id="thumbnail-video"
                        type="file"
                        className="hidden"
                        accept="image/png"
                      />
                    </div>
                    </div>


                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id="description"
                        rows={3}
                        placeholder="Descripcion"
                        required
                      />
                    </div>
                    <div className="grid gap-2 content-start">
                      <Label htmlFor="video-file">Video</Label>
                      <Button
                        onClick={() => videoRef.current?.click()}
                        variant="outline"
                        className="flex justify-start gap-4"
                      >
                        <Paperclip className="size-4" />
                        <span>mp4/mkv</span>
                      </Button>
                      <Input
                        ref={videoRef}
                        required
                        onChange={handleVideoChange}
                        id="video-file"
                        type="file"
                        className="hidden"
                        accept="video/mp4, video/mkv"
                      />
                    </div>

                    <div className="grid gap-2 content-start">
                      <Label htmlFor="thumbnail">Archivos adicionales</Label>
                      <Button
                        onClick={() => {
                          console.log("open a new window to add the files")
                        }}
                        variant="outline"
                        className="flex justify-start gap-4"
                      >
                        <Paperclip className="size-4" />
                        <span>SVG permitido</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button>Crear video</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 lg:grid-cols-12 gap-4">
        <div className="col-span-6 lg:col-span-8">
          <div className="">
            {video ? (
            <video className="rounded-[0.75rem] h-[100%] w-[100%]" controls>
              <source src={videoPreview} type="video/mp4" />
            </video>
            ) : (
            <div className="w-full h-[500px] flex justify-center items-center border rounded-[0.75rem]">
              <VideoIcon />
              <p className="text-zinc-200 text-center pl-2">video preview</p>
            </div>
            )}
          </div>
          <h1 className="text-zinc-200 mt-4 text-xl font-semibold">
            {title}
          </h1>

          <p className="text-zinc-400 mt-2">
          {description}
            </p>
          <div className="mt-2 flex gap-2">
            <Button>Ver archivos</Button>
            <Button>Abrir notas</Button>
          </div>
        </div>
        <div className="col-span-6 lg:col-span-4">
          <div className="">
            <div
              className="mb-2 p-1 hover:bg-zinc-800 rounded-[0.75rem] cursor-pointer 
        transition-colors duration-200 border-indigo-600"
            >
              <div className="relative">
                <div className="relative overflow-hidden rounded-[0.75rem] border-[1px] border-indigo-600/50">
                  {thumbnail ? (
                    <img src={filePreview} alt="" className="w-full" />
                  ) : (
                    <img src={Image} alt="" className="w-full" />
                  )}
                  <div
                    className={`absolute 
                    bottom-0 left-0 
                    h-[6px] bg-indigo-600 rounded-b-[0.75rem]`}
                  ></div>
                </div>
              </div>
              <div className="flex-col mx-2">
                <h4 className="font-semibold mt-2">{title}</h4>
                <p className="text-sm text-zinc-200 mt-2">{description}</p>
                <div className="flex gap-2 mt-2">
                  <p className="text-sm text-zinc-400">{duration}</p>
                  <p className="text-sm text-zinc-400">•</p>
                  <p className="text-sm text-zinc-400">13000 views</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
