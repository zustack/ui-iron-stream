import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Command } from "@tauri-apps/api/shell";
import { platform } from "@tauri-apps/api/os";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/users";
import { useAuthStore } from "@/store/auth";
import { ErrorResponse } from "@/types";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pc, setPc] = useState("");

  const { setAuthState } = useAuthStore();
  const navigate = useNavigate()

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

  const loginMutation = useMutation({
    mutationFn: () => login(email, password, pc),
    onSuccess: (response) => {
      setAuthState(response.token, response.userId, response.isAdmin, response.exp);
      navigate("/home");
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate();
  };

 const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold mb-6">Iniciar sesión</h1>
            <p className="text-balance text-muted-foreground mb-4">
              Ingresa tu correo electrónico para iniciar sesión.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2 mb-4">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                required
              />
            </div>
            <div className="grid gap-2 mb-4">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  to="/reset-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Usa al menos 6 caracteres"
                id="password"
                type="password"
                required
              />
            </div>
            <Button className="bg-indigo-600 text-white font-semibold hover:bg-indigo-500">
              Iniciar sesión
            </Button>
          </form>

          <div className="text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="underline">
              Registrate
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
      {loading && (
        <div className="text-center flex justify-center items-center">
          <p className="text-red-500 text-4xl">Loading SLDKFNSDLFNLSAFNSKFNSDLFN...</p>
        </div>
      )}
      <img
      src="https://helpfadu.com.ar/static/PORTADA.png"
        alt="Image"
      className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      onLoad={handleImageLoad}
      />
      </div>
    </div>
  );
}
