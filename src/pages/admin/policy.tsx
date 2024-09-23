import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getPolicy } from "@/api/policy";
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
  const { data, isFetching, isError } = useQuery({
    queryKey: ["policy"],
    queryFn: () => getPolicy(),
  });

  return (
    <>
      <div className="bg-muted/40 flex justify-between items-center px-[10px] h-[60px] border border-b">
        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm text-muted-foreground">

          {data != null && !isFetching && (
            <span>
              {data?.length}{" "}
              {data?.length === 1 ? " policy found." : " policys found."}
            </span>
          )}
          </p>
          <CreatePolicy />
        </div>
      </div>

      <ScrollArea className="h-full max-h-[calc(100vh-10px-60px)] w-full p-[10px]">
        <Table>
          <TableCaption>

          {data == null && !isFetching && (
              <div className="h-[100px] flex justify-center items-center">
                No policies found
              </div>
            )}

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
