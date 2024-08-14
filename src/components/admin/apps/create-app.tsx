import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader,
  Paperclip,
  PlusCircle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
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
import { createApp } from "@/api/apps";

export default function CreateApp({
  isLoading,
}: {
  invalidate: () => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");
  const [processName, setProcessName] = useState("");
  const [os, setOs] = useState("");
  const [active,setActive] = useState(false)

  // add mutation and api/apps async fucntion
  const createAppMutation = useMutation({
    mutationFn: () => createApp(name, processName, os, active),
    onSuccess: () => {
      toast.success("App Creada");
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  return (
    <AlertDialog>
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
                        <Label htmlFor="first-name">Titulo</Label>
                        <Input
                          id="first-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Name"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="first-name">Process Name</Label>
                        <Input
                          id="first-name"
                          value={processName}
                          onChange={(e) => setProcessName(e.target.value)}
                          placeholder="Process Name"
                          required
                        />
                      </div>


                      <div className="grid gap-2">
                        <Label htmlFor="first-name">Os</Label>
                        <Input
                          id="first-name"
                          value={os}
                          onChange={(e) => setOs(e.target.value)}
                          placeholder="Process Name"
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
            Crear app
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
