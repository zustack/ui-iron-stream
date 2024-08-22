import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListFilter, Loader, Search, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import CreateApp from "@/components/admin/apps/create-app";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, ChangeEvent, useEffect } from "react";
import { deleteApp, getAdminApps, updateAppStatus } from "@/api/apps";
import UpdateApp from "@/components/admin/apps/update-app";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
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

export default function AdminApps() {
  const [searchParam, setSearchParam] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [active, setActive] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, status, error } = useQuery({
    queryKey: ["admin-apps", debouncedSearchTerm, active],
    queryFn: () => getAdminApps(debouncedSearchTerm, active),
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchParam);
    }, 800);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchParam]);

  const deleteAppMutation = useMutation({
    mutationFn: (id: number) => deleteApp(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-apps"] });
      setIsOpen(false);
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  const updateAppStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      updateAppStatus(id, isActive),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-apps"] });
      setIsOpen(false);
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchParam(value);
  };

  return (
    <>
      <div className="bg-muted/40 flex justify-between pt-2 pb-[10px] px-11 border border-b">
        <div>
          <form className="ml-auto flex-1 sm:flex-initial mr-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchParam}
                onChange={handleInputChange}
                type="search"
                placeholder="Search for apps"
                className="pl-8 w-[450px]"
              />
            </div>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            <span>{data && data.length} apps.</span>
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filtrar
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                asChild={false}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                checked={active === ""}
                onClick={() => {
                  if (active === "") {
                    setActive("");
                  } else {
                    setActive("");
                  }
                }}
              >
                Ninguno
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                asChild={false}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                checked={active === "0"}
                onClick={() => {
                  if (active === "0") {
                    setActive("");
                  } else {
                    setActive("0");
                  }
                }}
              >
                No Activo
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                asChild={false}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                checked={active === "1"}
                onClick={() => {
                  if (active === "1") {
                    setActive("");
                  } else {
                    setActive("1");
                  }
                }}
              >
                Activo
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateApp />
        </div>
      </div>

      <ScrollArea className="h-full max-h-[calc(100vh-4rem)] w-full p-11">
        <Table>
          <TableCaption>
            {data == null && (
              <div className="h-[100px] flex justify-center items-center">
                No apps found
              </div>
            )}
            {status === "pending" ? (
              <div className="h-[100px] flex justify-center items-center">
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              </div>
            ) : null}

            {status === "error" ? <span>Error: {error.message}</span> : null}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Activo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Process Name</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data &&
              data.map((app: any) => (
                <TableRow>
                  <TableCell>
                    {updateAppStatusMutation.isPending ? (
                      <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                    ) : (
                      <Checkbox
                        onClick={() => {
                          updateAppStatusMutation.mutate({
                            id: app.id,
                            isActive: !app.is_active,
                          });
                        }}
                        checked={app.is_active}
                      />
                    )}
                  </TableCell>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.process_name}</TableCell>
                  <TableCell>{app.created_at}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog
                      onOpenChange={(open: boolean) => setIsOpen(open)}
                      open={isOpen}
                    >
                      <AlertDialogTrigger>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 gap-1 mx-1"
                        >
                          <Trash className="h-5 w-5 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Estas seguro de eliminar el curso {app.name}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <p>
                              Esta operación no se puede deshacer. Procede con
                              cuidado
                            </p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cerrar</AlertDialogCancel>
                          <Button
                            onClick={() => {
                              deleteAppMutation.mutate(app.id);
                            }}
                            variant={"destructive"}
                          >
                            {deleteAppMutation.isPending && (
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Eliminar
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <UpdateApp app={app} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
