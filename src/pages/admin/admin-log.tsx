import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "lucide-react";
import { getAdminLog } from "@/api/admin_log";

export default function AdminLog() {
  const { data, isFetching, isError } = useQuery({
    queryKey: ["admin-log"],
    queryFn: () => getAdminLog(),
  });

  return (
    <>
      <div className="bg-muted/40 flex justify-between items-center px-[10px] h-[60px] border border-b">
        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            <span>
              {data?.length}{" "}
              {data?.length === 1 ? " logs found." : " logs found."}
            </span>
          </p>
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
              <TableHead>Content</TableHead>
              <TableHead className="text-right">Created at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((p: any) => (
              <TableRow>
                <TableCell>{p.content}</TableCell>
                <TableCell className="text-right">
                  {p.created_at}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
