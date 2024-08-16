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
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Command } from '@tauri-apps/api/shell'

export default function ForbiddenApps({ apps }: any) {
  const [show, setShow] = useState(true);

  /*
    import { Command } from '@tauri-apps/api/shell'
    new Command('kill-win', ['/IM', 'app', '/F'])
    * tauri.conf.json
            "name": "kill-win",
            "cmd": "taskkill",
            "args": ["/IM", { "validator": "\\S+" }, "/F"] 
  */

  function killApps(apps: any) {
    // check the os and execute a different command depending of that
    for (const app of apps) {
      new Command('kill-win', ['/IM', app, '/F'])
    }
  }

  // if the user click kill apps automatically
  // esto deberia estar en video.tsx, donde cada (x) time cierra las aplicaciones
  // si una condicion se cumple, si el video esta en pausa no se ejecuta nada
  // para no gastar recursos
  // una opcion para poder cambiar el estado?

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
