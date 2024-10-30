import {
  createUserApp,
  deleteUserAppsByAppIdAndUserId,
  getUserApps,
} from "@/api/user-apps";
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
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorResponse } from "@/types";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Spinner from "@/components/ui/spinner";

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-apps-admin", userId],
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
          <AlertDialogTitle className="scroll-m-20 bold text-2xl tracking-tight">
          Add apps to user</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col py-2 pb-4">
              <p>
                Name: {name} {surname}
              </p>
              <p>Email: {email}</p>
            </div>
            <ScrollArea className="h-[300px]">
              <Table className="p-1">
                <TableCaption>
                  {data?.length === 0 && (
                    <div className="text-center text-zinc-400">
                      No results found.
                    </div>
                  )}

                  {isLoading && (
                    <div className="h-[100px] flex justify-center items-center">
                      <Spinner />
                    </div>
                  )}

                  {isError && (
                    <div className="h-[100px] flex justify-center items-center">
An unexpected error occurred.
                    </div>
                  )}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Process name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {data?.map((app: any) => (
                  <TableRow>
                    <TableCell>
                    {app.id === activeUpdateId &&
                    (createUserAppMutation.isPending ||
                      deleteUserAppMutation.isPending) ? (
                    <Spinner />
                    ) : (
                      <Checkbox
                        checked={app.is_user_enrolled}
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
                    </TableCell>
                    <TableCell>{app.name}</TableCell>
                    <TableCell>{app.process_name}</TableCell>
                  </TableRow>
                ))}
                </TableBody>

              </Table>
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
