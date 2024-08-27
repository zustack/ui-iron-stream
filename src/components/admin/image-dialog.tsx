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
import { Button } from "../ui/button";
import { Eye } from "lucide-react";

export default function ImageDialog({
  title,
  src,
}: {
  title: string;
  src: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="outline" size="icon" className="h-8 gap-1">
          <Eye className="h-5 w-5 text-zinc-200" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-5xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Image for the course {title}.</AlertDialogTitle>
          <AlertDialogDescription>
            <img className="rounded-[0.15rem]" src={src} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
