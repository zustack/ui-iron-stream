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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { File, GalleryVerticalEnd, Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserLog } from "@/api/user_log";
import jsPDF from "jspdf";
import "jspdf-autotable";

type Props = {
  userId: number;
  email: string;
  name: string;
  surname: string;
};

export default function AdminUserLog({ userId, email, name, surname }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<any[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-log", userId],
    queryFn: () => getUserLog(userId),
    enabled: isOpen,
  });

  const handleSelect = (logId: number) => {
    if (selected.includes(logId)) {
      setSelected(selected.filter((id) => id !== logId));
    } else {
      setSelected([...selected, logId]);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    const columns = ["Information", "Created at"];
    const rows =
      data
        ?.filter((log: any) => selected.includes(log.id))
        .map((log: any) => [log.content, log.created_at]) || [];

    (doc as any).autoTable({
      headStyles: { fillColor: [124, 95, 240] },
      head: [columns],
      body: rows,
      margin: { top: 30 },
      didDrawPage: () => {
        doc.setFontSize(15);
        doc.text(`User log for ${name} ${surname}`, 14, 22);
      },
    });

    doc.save(`${name}-${surname}.pdf`);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <Button variant="outline" size="icon" className="h-8 gap-1 mx-1">
          <GalleryVerticalEnd className="h-5 w-5 text-zinc-200" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex justify-between">
            <h1>User log</h1>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1"
              onClick={exportPDF}
            >
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col py-2 pb-4">
              <p>
                Name: {name} {surname}
              </p>
              <p>Email: {email}</p>
            </div>
            <ScrollArea className="h-[700px]">
              <Table id="user-log" className="p-1">
                <TableCaption>
                  {data?.length === 0 && (
                    <div className="text-center text-zinc-400">
                      No results found.
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
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Information</TableHead>
                    <TableHead className="text-right">Created at</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((l: any) => (
                    <TableRow key={l.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.includes(l.id)}
                          onCheckedChange={() => handleSelect(l.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {l.l_type === "3" && (
                          <p className="text-red-500">{l.content}</p>
                        )}
                        {l.l_type === "1" && <p>{l.content}</p>}
                      </TableCell>
                      <TableCell className="text-right">
                        {l.created_at}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
