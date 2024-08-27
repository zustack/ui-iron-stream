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
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
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
            Create app
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription>
            <div className="">
              <div className="flex items-center justify-center p-2">
                <div className="mx-auto grid w-full max-w-md gap-6">
                  <div className="mx-auto grid w-full max-w-2xl gap-6">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Name"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="process_name">Process name</Label>
                        <Input
                          id="process_name"
                          value={processName}
                          onChange={(e) => setProcessName(e.target.value)}
                          placeholder="Process name"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={active}
                          onCheckedChange={(active: boolean) =>
                            setActive(active)
                          }
                          id="is_active"
                        />
                        <label
                          htmlFor="is_active"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {active ? "Active" : "Non active"}
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
          <AlertDialogCancel disabled={createAppMutation.isPending}>
            Close
          </AlertDialogCancel>
          <Button
            className="flex gap-2"
            disabled={createAppMutation.isPending}
            onClick={() => createAppMutation.mutate()}
          >
            <span>Create app</span>
            {createAppMutation.isPending && (
              <Loader className="h-6 w-6 text-zinc-900 animate-spin slower" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
