import { createUserApp, deleteUserAppsByAppIdAndUserId, getUserApps } from "@/api/user-apps";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorResponse } from "@/types";
import toast from "react-hot-toast";

type Props = {
  userId: number;
  email: string;
  name: string;
  surname: string;
};

export default function UserApps({ userId, email, name, surname }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeUpdateId, setActiveUpdateId] = useState(0);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-apps-admin", userId],
    // is "" because we dont want to search a app here! or do we?
    queryFn: () => getUserApps(userId),
    enabled: isOpen,
  });

  const createUserAppMutation = useMutation({
    mutationFn: ({ userId, appId }: { userId: number; appId: number }) =>
      createUserApp(userId, appId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-apps-admin"] });
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  const deleteUserAppMutation = useMutation({
    mutationFn: ({ userId, appId }: { userId: number; appId: number }) =>
      deleteUserAppsByAppIdAndUserId(userId, appId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-apps-admin"] });
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <Button variant="outline" size="icon" className="h-8 gap-1 mx-1">
          <Plus className="h-5 w-5 text-zinc-200" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Agrega apps al usuario</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col py-2 pb-4">
              <p>
                Nombre: {name} {surname}
              </p>
              <p>Email: {email}</p>
            </div>
            <ScrollArea className="h-[200px] w-[350px]p-4">
              {data && data.data.length === 0 && (
                <div className="text-center text-zinc-400">
                  No se encontraron resultados
                </div>
              )}

              {isLoading && (
                <div className="h-[100px] flex justify-center items-center">
                  <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                </div>
              )}

              {isError && (
                <div className="h-[100px] flex justify-center items-center">
                  Error: {error.message}
                </div>
              )}

              {data &&
                data.data.map((app: any) => (
                  <div className="flex items-center space-x-2 py-2">
                    {app.id === activeUpdateId &&
                    (createUserAppMutation.isPending ||
                      deleteUserAppMutation.isPending) ? (
                      <Loader className="h-5 w-5 text-zinc-300 animate-spin slower items-center flex justify-center" />
                    ) : (
                      <Checkbox
                        checked={app.exists}
                        onClick={() => {
                          setActiveUpdateId(app.id);
                          if (app.exists) {
                          deleteUserAppMutation.mutate({
                            userId,
                            appId: app.id,
                          });
                          } else {
                          createUserAppMutation.mutate({
                            userId,
                            appId: app.id,
                          });
                          }
                        }}
                        id="terms"
                      />
                    )}
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {app.name} {app.id}
                    </label>
                  </div>
                ))}
            </ScrollArea>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
