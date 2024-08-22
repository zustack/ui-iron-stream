import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
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
import { createApp } from "@/api/apps";

export default function CreateApp() {
  const [name, setName] = useState("");
  const [processName, setProcessName] = useState("");
  const [active, setActive] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const createAppMutation = useMutation({
    mutationFn: () => createApp(name, processName, active),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-apps"] });
      setIsOpen(false);
      setName("");
      setProcessName("");
      setActive(true);
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  return (
    <AlertDialog
      onOpenChange={(open: boolean) => setIsOpen(open)}
      open={isOpen}
    >
      <AlertDialogTrigger>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Crear apps
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Agrega una nueva app
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="">
              <div className="flex items-center justify-center p-2">
                <div className="mx-auto grid w-full max-w-md gap-6">
                  <div className="mx-auto grid w-full max-w-2xl gap-6">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="first-name">Nombre de la app</Label>
                        <Input
                          id="first-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nombre de la app"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="first-name">Nombre del proceso</Label>
                        <Input
                          id="first-name"
                          value={processName}
                          onChange={(e) => setProcessName(e.target.value)}
                          placeholder="Nombre del proceso"
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
            onClick={() => createAppMutation.mutate()}
            className="w-[100px]"
          >
            {createAppMutation.isPending && (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Crear app</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
