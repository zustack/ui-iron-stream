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
import {
  Bell,
  Delete,
  ListFilter,
  Loader,
  PlusCircle,
  Search,
  Trash,
} from "lucide-react";
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
import { useEffect, useState, ChangeEvent } from "react";
import CreateCourse from "@/components/admin/courses/create-course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { adminReviews, updatePublicStatus } from "@/api/reviews";
import StarIcon from "@mui/icons-material/Star";
import { Rating } from "@mui/material";
import DeleteReview from "@/components/admin/delete-review";
import { deleteNotifications } from "@/api/notifications";
import { Card } from "@/components/ui/card";
import Items from "@/components/admin/policy/items";
import { deletePolicy, getPolicy } from "@/api/policy";
import CreatePolicy from "@/components/admin/policy/create-policy";

export default function AdminPolicy() {
  const queryClient = useQueryClient();
  const [currentId, setCurrentId] = useState(0);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["admin-policy"],
    queryFn: () => getPolicy(),
  });

  const deletePolicyMutation = useMutation({
    mutationFn: (id: number) => deletePolicy(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-policy"] });
      setCurrentId(0);
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  return (
    <>
      <div className="bg-muted/40 flex justify-between items-center px-[10px] h-[60px] border border-b">
        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            <span>
              {data?.length}{" "}
              {data?.length === 1 ? " policy found." : " policys found."}
            </span>
          </p>
        </div>

        <CreatePolicy />
      </div>

      <ScrollArea className="h-full max-h-[calc(100vh-10px-60px)] w-full p-[10px]">
        <div className="flex justify-center">
          <div className="bg-zinc-900 w-[800px] p-[10px] rounded-[10px]">
            {data == null && <p className="text-center">No data</p>}
            {isFetching && <p className="text-center">loading...</p>}
            {isError && <p className="text-center">Something went wrong</p>}
            {data?.map((p: any) => (
              <>
                <h1 className="text-3xl font-semibold">{p.title}</h1>
                <Button
                  onClick={() => {
                    setCurrentId(p.id);
                    deletePolicyMutation.mutate(p.id);
                  }}
                >
                  {currentId == p.id && deletePolicyMutation.isPending && (
                    <p>Loading...</p>
                  )}
                  Delete
                </Button>
                <Items id={p.id} />
              </>
            ))}
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
