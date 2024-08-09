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
import { useMutation } from "@tanstack/react-query";
import { deleteVideo } from "@/api/videos";
import { ErrorResponse } from "@/types";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DeleteVideo({
  invalidate,
  isLoading,
  id,
}: {
  invalidate: () => void;
  isLoading: boolean;
  id: number;
}) {

  const { courseTitle } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsOpen(false);
    }
  }, [isLoading]);


  const deleteVideoMutation = useMutation({
    mutationFn: () => deleteVideo(id),
    onSuccess: () => {
      invalidate();
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
            Estas seguro de eliminar el curso {courseTitle}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p>Esta operación no se puede deshacer. Procede con cuidado</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          <Button
            className="w-[100px]"
            disabled={deleteVideoMutation.isPending || isLoading}
            onClick={() => {
              deleteVideoMutation.mutate();
            }}
            variant={"destructive"}
          >
            {deleteVideoMutation.isPending || isLoading ? (
              <Loader className="h-6 w-6 text-white animate-spin slower items-center flex justify-center" />
            ) : (
              <span>Eliminar</span>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
