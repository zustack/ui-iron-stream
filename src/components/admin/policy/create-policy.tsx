import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Loader, PlusCircle } from "lucide-react";
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
import { createPolicy } from "@/api/policy";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const pTypes = [
  {
    value: "text",
    label: "Text",
  },
  {
    value: "title",
    label: "Title",
  },
  {
    value: "li",
    label: "List item",
  },
];

export default function CreatePolicy() {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");

  const queryClient = useQueryClient();

  const createPolicyMutation = useMutation({
    mutationFn: () => createPolicy(content, type),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["policy"] });
      setIsOpen(false);
      setContent("");
      setType("");
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
            Create policy
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Create new policy
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="">
              <div className="flex items-center justify-center p-2">
                <div className="mx-auto grid w-full max-w-md gap-6">
                  <div className="mx-auto grid w-full max-w-2xl gap-6">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Content"
                          required
                          rows={5}
                        />
                      </div>

                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                          >
                            {type
                              ? pTypes.find((t) => t.value === type)?.label
                              : "Select policy type..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[448px] p-0">
                          <Command>
                            <CommandList>
                              <CommandEmpty>No policy type found.</CommandEmpty>
                              <CommandGroup>
                                {pTypes.map((t) => (
                                  <CommandItem
                                    key={t.value}
                                    value={t.value}
                                    onSelect={(currentValue) => {
                                      setType(
                                        currentValue === type
                                          ? ""
                                          : currentValue
                                      );
                                      setOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        type === t.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {t.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={createPolicyMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={() => createPolicyMutation.mutate()}
            className="flex gap-2"
            disabled={createPolicyMutation.isPending}
          >
            <span>Create policy</span>
            {createPolicyMutation.isPending && (
              <Loader className="h-6 w-6 text-zinc-900 animate-spin slower" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
