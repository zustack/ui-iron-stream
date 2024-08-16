import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Checkbox } from "./ui/checkbox";

export default function ForbiddenApps({ apps }: any) {
  const [show, setShow] = useState(true);
  return (
    <AlertDialog open={show} onOpenChange={setShow}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>El video se ha pausado</AlertDialogTitle>
          <AlertDialogDescription>
            Este video se encuentra pausado ya que estas usando aplicaciones no
            permitidas en la politica de privacidad de Iron Stream Las
            aplicaciones detectadas que violan la politica de privacidad son:
            {apps.map((app: any) => (
              <ul>
                <li className="text-red-500">{app.name}</li>
              </ul>
            ))}
            Puedes usar las aplicaciones mientras el video esta pausado cuando
            termines de usar las aplicaciones, da click en el boton de continuar
            viendo el video, va a cerrar las aplicaciones no permitidas en
            primer y segundo plano
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cerrar las aplicaciones no permitidas de manera automatica,
                Podras abrirlas mientras el video este pausado.
              </label>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continutar viendo</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
