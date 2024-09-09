import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { deletePolicy, getPolicy } from "@/api/policy";
import CreatePolicy from "@/components/admin/policy/create-policy";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import DeletePolicy from "@/components/admin/policy/delete-policy";
import { Loader } from "lucide-react";

export default function AdminPolicy() {
  const queryClient = useQueryClient();
  const [currentId, setCurrentId] = useState(0);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["policy"],
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
          <CreatePolicy />
        </div>
      </div>

      <ScrollArea className="h-full max-h-[calc(100vh-10px-60px)] w-full p-[10px]">
        <Table>
          <TableCaption>
            {isFetching && (
              <div className="h-[100px] flex justify-center items-center">
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              </div>
            )}

            {isError && (
              <div className="h-[100px] flex justify-center items-center">
                <span>An unexpected error occurred getting the policies.</span>
              </div>
            )}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead className="w-[100px]">List item</TableHead>
              <TableHead className="w-[100px]">Text</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="w-[200px]">Created at</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((p: any) => (
              <TableRow>
                <TableCell>
                  <Checkbox disabled={true} checked={p.p_type == "title"} />
                </TableCell>
                <TableCell>
                  <Checkbox disabled={true} checked={p.p_type == "li"} />
                </TableCell>
                <TableCell>
                  <Checkbox disabled={true} checked={p.p_type == "text"} />
                </TableCell>
                <TableCell>{p.content}</TableCell>
                <TableCell>{p.created_at}</TableCell>
                <TableCell className="text-right">
                  <DeletePolicy id={p.id} title={p.content} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
