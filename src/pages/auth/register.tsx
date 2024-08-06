import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/ui/password-input";
import { Link, useNavigate } from "react-router-dom";
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
import { Command } from "@tauri-apps/api/shell";
import { platform } from "@tauri-apps/api/os";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "@/types";
import { register } from "@/api/users";
import EmailVerification from "@/components/auth/email-verfication";

export default function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pc, setPc] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function getSerialNumber() {
      const platformName = await platform();
      let commandName: string = "";

      if (platformName === "darwin") {
        commandName = "serial-mac";
      } else if (platformName === "win32") {
        commandName = "serial-win";
      } else if (platformName === "linux") {
        commandName = "serial-linux";
      } else {
        toast.error("Ocurrio un error");
        return;
      }

      const command = new Command(commandName);
      const output = await command.execute();
      const data = output.stdout;

      if (data && platformName == "darwin") {
        const match = data.match(/Serial Number \(system\): (\w+)/);
        if (match) {
          const serial_number = match[1];
          setPc(serial_number);
        }
      }

      if (data && platformName == "win32") {
        const trimOutput = data.trim().replace(/[\r\n]+/g, "");
        const serial_number = trimOutput.replace(/^SerialNumber\s+/i, "");
        setPc(serial_number);
      }

      if (data && platformName == "linux") {
        setPc(data);
      }
    }
    getSerialNumber();
  }, []);

  const registerMutation = useMutation({
    mutationFn: () => register(email, fullName, password, pc),
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (error: ErrorResponse) => {
      console.log(error)
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    registerMutation.mutate();
  };

  if (success) {
    return (
      <EmailVerification email={email} />
    )
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold mb-6">Crear cuenta</h1>
            <p 
            onClick={()=>       setSuccess(true)}
            className="text-balance text-muted-foreground mb-4">
              Ingresa tu datos para crear una cuenta.
            </p>
          </div>
          <form 
          onSubmit={handleSubmit}
          className="grid gap-4">
            <div className="grid gap-2 mb-4">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                id="email"
                type="email"
                placeholder="ejemplo@gmail.com"
                required
              />
            </div>

            <div className="grid gap-2 mb-4">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                type="text"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="grid gap-2 mb-4">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
              </div>

              <PasswordInput
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                id="password"
                placeholder="••••••••"
              />
            </div>

            <div className="grid gap-2 mb-4">
              <div className="flex items-center">
                <Label htmlFor="password">Confirmar contraseña</Label>
              </div>
              <PasswordInput
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
                id="password"
                placeholder="••••••••"
              />
            </div>

            <div className="items-top flex space-x-2 mb-4">
              <Checkbox id="terms" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed 
          peer-disabled:opacity-70"
                >
                  Aceptar los{" "}
                  <AlertDialog>
                    <AlertDialogTrigger className="underline">
                      terminos y condiciones
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Terminos y Condiciones
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          With less than a month to go before the European Union
                          enacts new consumer privacy laws for its citizens,
                          companies around the world are updating their terms of
                          service agreements to comply.
                        </AlertDialogDescription>

                        <AlertDialogDescription>
                          The European Union’s General Data Protection
                          Regulation (G.D.P.R.) goes into effect on May 25 and
                          is meant to ensure a common set of data rights in the
                          European Union. It requires organizations to notify
                          users as soon as possible of high-risk data breaches
                          that could personally affect them.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cerrar</AlertDialogCancel>
                        <AlertDialogAction>Aceptar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </label>
              </div>
            </div>
            <Button
              type="submit"
              className="bg-indigo-400 text-black font-semibold hover:bg-indigo-500"
            >
              Crear cuenta
            </Button>
          </form>

          <div className="text-center text-sm">
            ¿Tienes una cuenta?{" "}
            <Link to="/login" className="underline">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="https://kive.ai/assets/login-41fe131e.webp"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
