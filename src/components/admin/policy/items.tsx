import { createPolicyItem, deletePolicyItem, getPolicyItems } from "@/api/policy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Delete } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";

export default function Items({ id }: { id: number }) {
  const [body, setBody] = useState("");
  const [currentId, setCurrentId] = useState(0);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["admin-policy-items", id],
    queryFn: () => getPolicyItems(id),
  });

  const queryClient = useQueryClient();

  const createPolicyItemMutation = useMutation({
    mutationFn: () => createPolicyItem(body, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-policy-items"] });
      setBody("");
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const deletePolicyItemMutation = useMutation({
    mutationFn: (polId: number) => deletePolicyItem(polId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-policy-items"] });
      setBody("");
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  return (
    <div className="flex flex-col gap-[10px] pt-[10px]">
      <Input className="w-full" 
      value={body}
      onChange={(e) => setBody(e.target.value)}
      placeholder="Item body" />
      <Button
        disabled={createPolicyItemMutation.isPending}
        onClick={() => {
          createPolicyItemMutation.mutate();
        }}
        variant={"outline"}
      >
        {createPolicyItemMutation.isPending && <p>Loading...</p>}
        Create new item
      </Button>
      {isFetching && <p className="text-center">loading...</p>}
      {isError && <p className="text-center">Something went wrong</p>}
      {data?.map((p: any) => (
        <div className="flex items-center gap-[10px] pl-[20px]">
          <li>{p.body}</li>
          {(currentId == p.id && createPolicyItemMutation.isPending) ? (
            <p>Loading...</p>
          ) : (
          <Delete 
          onClick={() => {
            deletePolicyItemMutation.mutate(p.id);
            setCurrentId(p.id)
          }}
          className="h-6 w-6 text-red-500" />
          )}
        </div>
      ))}
    </div>
  );
}
