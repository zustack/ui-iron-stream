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
import { Loader, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVideo } from "@/api/videos";
import { ErrorResponse } from "@/types";
import toast from "react-hot-toast";
import { useState } from "react";
import { createAdminLog } from "@/api/admin_log";

export default function DeleteVideo({
  title,
  id,
}: {
  title: string;
  id: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const createAdminLogMutation = useMutation({
    mutationFn: () => createAdminLog(`The video ${title} has been deleted`, "3"),
  });

  const deleteVideoMutation = useMutation({
    mutationFn: () => deleteVideo(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      createAdminLogMutation.mutate()
      setIsOpen(false);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data?.error || "Ocurrió un error inesperado");
    },
  });

  return (
    <AlertDialog onOpenChange={(is: boolean) => setIsOpen(is)} open={isOpen}>
      <AlertDialogTrigger>
        <Button variant="outline" size="icon" className="h-8 gap-1 mx-1">
          <Trash className="h-5 w-5 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete {title}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p>This operation cannot be reverted, proceed with caution.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
          disabled={deleteVideoMutation.isPending}
          >Cerrar</AlertDialogCancel>
          <Button
            onClick={() => {
              deleteVideoMutation.mutate();
            }}
            variant={"destructive"}
            disabled={deleteVideoMutation.isPending}
            className="flex gap-2"
          >
            Delete
            {deleteVideoMutation.isPending && (
              <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
