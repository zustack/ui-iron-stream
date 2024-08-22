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
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";

type Props = {
  userId: number;
  email: string;
  name: string;
  surname: string;
  special_app: boolean;
};

export default function TrueSpecialApps({
  userId,
  email,
}: Props) {

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="outline" size="icon" className="h-8 gap-1 mx-1">
          <Plus className="h-5 w-5 text-zinc-200" />T
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Agregar aplicaciones especiales al usuario {email} {userId}
            <button
            // onClick={() => setAllApps()}
            >Set apps</button>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <ScrollArea className="h-[200px] w-[350px]p-4">
            </ScrollArea>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          <AlertDialogAction>
            <Button
              onClick={() => {
              }}
            >
              Agregar
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
