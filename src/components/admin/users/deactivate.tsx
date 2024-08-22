import {
  deactivateAllCourses,
  deactivateCourseForAllUsers,
  updateActiveStatusAllUser,
} from "@/api/users";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ErrorResponse } from "@/types";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { adminCourses, coursesByUserId } from "@/api/courses";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Loader, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteAllUserCourses,
  deleteUserCourseByCourseId,
} from "@/api/user-courses";

export default function Deactivate() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Menu className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Acciones
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col" align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DeactivateAllUsers />
        <ActivateAllUsers />
        <DeactivateAllCourses />
        <DeactivateIndividualCourses />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const DeactivateAllUsers = () => {

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // update the queryKey de users
  const updateActiveStatusAllUserMutation = useMutation({
    mutationFn: () => updateActiveStatusAllUser(false),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsOpen(false);
      toast.success("Todos los usuarios fueron desactivados");
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
        <DropdownMenuItem
          asChild={false}
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          Desactivar todos los usuarios
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desactivar todos los usuarios</AlertDialogTitle>
          <AlertDialogDescription>
            Esta operación no se puede deshacer. Procede con cuidado
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {updateActiveStatusAllUserMutation.isPending ? (
            <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
          ) : (
            <Button
              variant={"destructive"}
              onClick={() => updateActiveStatusAllUserMutation.mutate()}
            >
              Confirmar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ActivateAllUsers = () => {
// updateActiveStatusAllUser 
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateActiveStatusAllUserMutation = useMutation({
    mutationFn: () => updateActiveStatusAllUser(true),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Todos los usuarios fueron activados");
      setIsOpen(false);
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
        <DropdownMenuItem
          asChild={false}
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          Activar todos los usuarios
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desactivar todos los usuarios</AlertDialogTitle>
          <AlertDialogDescription>
            Esta operación no se puede deshacer. Procede con cuidado
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {updateActiveStatusAllUserMutation.isPending ? (
            <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
          ) : (
            <Button
              variant={"destructive"}
              onClick={() => updateActiveStatusAllUserMutation.mutate()}
            >
              Confirmar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const DeactivateAllCourses = () => {
  const [isOpen, setIsOpen] = useState(false);

  const deleteAllUserCoursesMutation = useMutation({
    mutationFn: () => deleteAllUserCourses(),
    onSuccess: () => {
      toast.success("Cursos desactivados");
      setIsOpen(false);
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
        <DropdownMenuItem
          asChild={false}
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          Desactivar todos los cursos
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desactivar todos los cursos</AlertDialogTitle>
          <AlertDialogDescription>
            Esta operación no se puede deshacer. Procede con cuidado
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {deleteAllUserCoursesMutation.isPending ? (
            <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
          ) : (
            <Button
              variant={"destructive"}
              onClick={() => deleteAllUserCoursesMutation.mutate()}
            >
              Confirmar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const DeactivateIndividualCourses = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(0);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["deactivate-individual-courses"],
    queryFn: () => adminCourses("", "1"),
    enabled: isOpen,
  });

  const deleteUserCourseByCourseIdMutation = useMutation({
    mutationFn: () => deleteUserCourseByCourseId(confirmId),
    onSuccess: () => {
      setConfirmId(0);
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
        <DropdownMenuItem
          asChild={false}
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          Desactivar cursos individuales
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desactivar cursos individuales</AlertDialogTitle>
          <AlertDialogDescription>
            <ScrollArea className="h-[200px] w-[350px]p-4">
              {data && data.length === 0 && (
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
                data.map((course: any) => (
                  <div className="flex items-center gap-2 space-x-2 py-2">
                    {confirmId === course.id ? (
                      <>
                        {deleteUserCourseByCourseIdMutation.isPending ? (
                          <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                        ) : (
                          <>
                            <Button
                              onClick={() => setConfirmId(0)}
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1 w-[100px]"
                            >
                              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Cancelar
                              </span>
                            </Button>
                            <Button
                              onClick={() => {
                                deleteUserCourseByCourseIdMutation.mutate();
                                // make mutation
                              }}
                              variant="destructive"
                              size="sm"
                              className="h-8 gap-1 w-[100px]"
                            >
                              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Confirmar
                              </span>
                            </Button>
                          </>
                        )}
                      </>
                    ) : (
                      <Button
                        onClick={() => setConfirmId(course.id)}
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1"
                      >
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Desactivar
                        </span>
                      </Button>
                    )}
                    {course.title}
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
};
