import { deleteAccountByEmail } from "@/api/users";
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
import { createAdminLog } from "@/api/admin_log";

type Props = {
  email: string;
  name: string;
  surname: string;
};

export default function DeleteUser({ email, name, surname }: Props) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const createAdminLogMutation = useMutation({
    mutationFn: () => createAdminLog(`The user with email ${email} has been deleted`, "3"),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (email: string) => deleteAccountByEmail(email),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsOpen(false);
      createAdminLogMutation.mutate();
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data?.error || "Ocurrió un error inesperado");
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
          <AlertDialogTitle>Are you sure to delete this user?</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col pb-4">
              <p>
                Nombre: {name} {surname}
              </p>
              <p>Email: {email}</p>
              <p className="pt-2">
                This action cannot be undone. will delete all the data related
                to this user, except for the name and last name in the reviews
                created by this user.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUserMutation.isPending}>
            Cerrar
          </AlertDialogCancel>
          <Button
            onClick={() => {
              deleteUserMutation.mutate(email);
            }}
            variant={"destructive"}
            disabled={deleteUserMutation.isPending}
            className="flex gap-2"
          >
            Eliminar
            {deleteUserMutation.isPending && (
              <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
