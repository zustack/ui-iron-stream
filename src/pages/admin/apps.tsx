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
import { ListFilter, Loader, Search } from "lucide-react";
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
import { getAdminApps, updateAppStatus, updateExecuteAlways } from "@/api/apps";
import UpdateApp from "@/components/admin/apps/update-app";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { App } from "@/types";
import DeleteApp from "@/components/admin/apps/delete-app";

export default function AdminApps() {
  const [searchParam, setSearchParam] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [active, setActive] = useState<string>("");
  const [activeAppId, setActiveAppId] = useState<number>(0);

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

  const updateAppStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      updateAppStatus(id, isActive),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-apps"] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const updateAppExecuteAlwaysMutation = useMutation({
    mutationFn: ({ id, eA }: { id: number; eA: boolean }) =>
      updateExecuteAlways(id, eA),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-apps"] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
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
          {data == null && status !== "pending" ? (
              <span>No apps found.</span>
          ) : (
            <span>
              {data?.length}{" "}
              {data?.length === 1 ? " app found." : " apps found."}
            </span>
          )}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
                Active
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
                Non active
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateApp />
        </div>
      </div>

      <ScrollArea className="h-full max-h-[calc(100vh-10px-60px)] w-full p-[10px]">
        <Table>
          <TableCaption>
          {data == null && status !== "pending" && (
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
              <TableHead>State</TableHead>
              <TableHead>Execute always</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Process name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((app: App) => (
              <TableRow>
                <TableCell>
                  {updateAppStatusMutation.isPending &&
                  activeAppId === app.id ? (
                    <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
                  ) : (
                    <Checkbox
                      onClick={() => {
                        updateAppStatusMutation.mutate({
                          id: app.id,
                          isActive: !app.is_active,
                        });
                        setActiveAppId(app.id);
                      }}
                      checked={app.is_active}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {updateAppExecuteAlwaysMutation.isPending &&
                  activeAppId === app.id ? (
                    <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
                  ) : (
                    <Checkbox
                      onClick={() => {
                        updateAppExecuteAlwaysMutation.mutate({
                          id: app.id,
                          eA: !app.execute_always,
                        });
                        setActiveAppId(app.id);
                      }}
                      checked={app.execute_always}
                    />
                  )}
                </TableCell>
                <TableCell>{app.name}</TableCell>
                <TableCell>{app.process_name}</TableCell>
                <TableCell>{app.created_at}</TableCell>
                <TableCell className="text-right">
                  <UpdateApp app={app} />
                  <DeleteApp
                    id={app.id}
                    name={app.name}
                    process_name={app.process_name}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
