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
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { useState } from "react";
import { deletePolicy } from "@/api/policy";
import { createAdminLog } from "@/api/admin_log";

type Props = {
  id: number;
  title: string;
};

export default function DeletePolicy({ id, title }: Props) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const createAdminLogMutation = useMutation({
    mutationFn: () => createAdminLog(`The policy ${title} has been deleted`, "3"),
  });

  const deletePolicyMutation = useMutation({
    mutationFn: () => deletePolicy(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["policy"] });
      createAdminLogMutation.mutate()
      setIsOpen(false);
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <Button variant="outline" size="icon" className="h-8 gap-1 mx-1">
          <Trash className="h-5 w-5 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this policy?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {title}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
          disabled={deletePolicyMutation.isPaused}
          >Cancel</AlertDialogCancel>
          <Button
            onClick={() => {
              deletePolicyMutation.mutate();
            }}
            variant={"destructive"}
            disabled={deletePolicyMutation.isPending}
            className="flex gap-2"
          >
            Delete
            {deletePolicyMutation.isPending && (
              <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
