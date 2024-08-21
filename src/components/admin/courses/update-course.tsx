import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Paperclip, Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateCourse, uploadChunk } from "@/api/courses";
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

type CourseProp = {
  id: number;
  title: string;
  description: string;
  author: string;
  duration: string;
  is_active: boolean;
  thumbnail: string;
  preview: string;
  sort_order: number;
};

export default function UpdateCourse({
  isLoading,
  invalidate,
  course,
}: {
  isLoading: boolean;
  invalidate: () => void;
  course: CourseProp;
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [active, setActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<File>();
  const [oldThumbnail, setOldThumbnail] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [video, setVideo] = useState<File>();
  const [oldVideo, setOldVideo] = useState("");
  const [isVideo, setIsVideo] = useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(course.title);
    setSortOrder(String(course.sort_order));
    setDescription(course.description);
    setAuthor(course.author);
    setDuration(course.duration);
    setActive(course.is_active);
    setOldThumbnail(course.thumbnail);
    setOldVideo(course.preview);
    if (course.preview) {
      setIsVideo(true);
    }
  }, [course]);

  useEffect(() => {
    if (!isLoading) {
      setIsOpen(false);
      setThumbnail(undefined);
      setVideo(undefined);
    }
  }, [isLoading]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setVideo(file);
      setIsVideo(true);
    }
  };

  type CourseData = {
    id: number;
    sort_order: number;
    title: string;
    description: string;
    author: string;
    duration: string;
    is_active: boolean;
    thumbnail: File | undefined;
    old_thumbnail: string;
    preview_tmp: string;
    old_video: string;
    isVideo: boolean;
  };

  const updateCourseMutation = useMutation({
    mutationFn: (courseData: CourseData) => updateCourse(courseData),
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
      updateCourseMutation.mutate({
        id: course.id,
        sort_order: Number(sortOrder),
        title,
        description,
        author,
        duration,
        is_active: active,
        thumbnail,
        old_thumbnail: oldThumbnail,
        old_video: oldVideo,
        preview_tmp: response,
        isVideo,
      });
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data?.error || "Ocurrió un error inesperado");
    },
  });

  function detonateChain() {
    if (video) {
      uploadChunkMutation.mutate(video);
      return;
    } else {
      updateCourseMutation.mutate({
        id: course.id,
        sort_order: Number(sortOrder),
        title,
        description,
        author,
        duration,
        is_active: active,
        thumbnail,
        old_thumbnail: oldThumbnail,
        old_video: oldVideo,
        preview_tmp: "",
        isVideo,
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
            Actualiza el curso {course.title}
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
                        <Label htmlFor="last-name">Autor</Label>
                        <Input
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          id="last-name"
                          placeholder="Robinson"
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
                          onChange={handleFileChange}
                          id="thumbnail"
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg, image/svg"
                        />
                      </div>

                      <div className="grid gap-2">
                        {isVideo ? (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={isVideo}
                              onCheckedChange={(active: boolean) =>
                                setIsVideo(active)
                              }
                              id="terms"
                            />
                            <label
                              htmlFor="terms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Video preview
                            </label>
                          </div>
                        ) : (
                          <Label htmlFor="video">Video</Label>
                        )}

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

                      <div className="grid gap-2">
                        <Label htmlFor="sort">Sort order</Label>
                        <Input
                          id="sort"
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          placeholder="Sort"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={active}
                          onCheckedChange={(active: boolean) =>
                            setActive(active)
                          }
                          id="terms"
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Estado {active ? "Activo" : "Inactivo"}
                        </label>
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
            className="w-[150px]"
            disabled={
              updateCourseMutation.isPending ||
              uploadChunkMutation.isPending ||
              isLoading
            }
            onClick={detonateChain}
          >
            {updateCourseMutation.isPending ||
            uploadChunkMutation.isPending ||
            isLoading ? (
              <Loader className="h-6 w-6 text-zinc-900 animate-spin slower items-center flex justify-center" />
            ) : (
              <span>Actualizar curso</span>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
