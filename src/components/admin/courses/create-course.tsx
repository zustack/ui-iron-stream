import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Paperclip, PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse, uploadChunk } from "@/api/courses";
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

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Created by ");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [active, setActive] = useState(false);
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<File>();
  const [video, setVideo] = useState<File>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

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

  type CourseData = {
    title: string;
    description: string;
    author: string;
    duration: string;
    is_active: boolean;
    price: string;
    thumbnail: File;
    preview_tmp: string;
  };

  const createCourseMutation = useMutation({
    mutationFn: (courseData: CourseData) => createCourse(courseData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      setIsOpen(false);
      setTitle("");
      setDescription("");
      setAuthor("Created by ");
      setActive(false);
      setPrice("");
      setDuration("");
      setThumbnail(undefined);
      setVideo(undefined);
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
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
          price,
          thumbnail,
          preview_tmp: response,
        });
      }
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  function detonateChain() {
    if (video) {
      uploadChunkMutation.mutate(video);
    } else {
      if (thumbnail) {
        createCourseMutation.mutate({
          title,
          description,
          author,
          duration,
          is_active: active,
          price,
          thumbnail,
          preview_tmp: "",
        });
      } else {
        toast.error("The thumbnail is required");
        return;
      }
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
            Create course
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center bold text-2xl">
            Create course
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
                        <Label htmlFor="author">Author</Label>
                        <Input
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          id="author"
                          placeholder="Author"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          id="description"
                          rows={5}
                          placeholder="Description"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="Duration">Duration</Label>
                        <Input
                          id="duration"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="Duration"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          value={price}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              setPrice(value);
                            }
                          }}
                          placeholder="Price"
                          inputMode="decimal"
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
                        <Label htmlFor="video">Video Preview</Label>
                        <Button
                          variant="outline"
                          className="flex justify-start gap-4"
                          onClick={() => videoRef.current?.click()}
                        >
                          <Paperclip className="size-4" />
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

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={active}
                          onCheckedChange={(active: boolean) =>
                            setActive(active)
                          }
                          id="active"
                        />
                        <label
                          htmlFor="active"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {active ? "Active" : "Non active"}
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
          <AlertDialogCancel
            disabled={
              createCourseMutation.isPending || uploadChunkMutation.isPending
            }
          >
            Cancel
          </AlertDialogCancel>
          <Button
            className="flex gap-2"
            disabled={
              createCourseMutation.isPending || uploadChunkMutation.isPending
            }
            onClick={detonateChain}
          >
            <span>Create course</span>
            {(createCourseMutation.isPending ||
              uploadChunkMutation.isPending) && (
              <Loader className="h-6 w-6 text-zinc-900 animate-spin slower" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
