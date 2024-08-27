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
import { ErrorResponse } from "@/types";
import toast from "react-hot-toast";
import { useState } from "react";
import { deleteApp } from "@/api/apps";

export default function DeleteApp({
  name,
  process_name,
  id,
}: {
  name: string;
  process_name: string;
  id: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteAppMutation = useMutation({
    mutationFn: () => deleteApp(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-apps"] });
      setIsOpen(false);
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
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
          <AlertDialogTitle>Are you sure to delete this app?</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col pb-4">
              <p>
                Name: {name} 
              </p>
              <p>Process name: {process_name}</p>
              <p className="pt-2">
                This action cannot be undone. Proceed with caution.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
          disabled={deleteAppMutation.isPending}
          >Cerrar</AlertDialogCancel>
          <Button
            onClick={() => {
              deleteAppMutation.mutate();
            }}
            variant={"destructive"}
            disabled={deleteAppMutation.isPending}
            className="flex gap-2"
          >
            Delete
            {deleteAppMutation.isPending && (
              <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
