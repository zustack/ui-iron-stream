import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function Login() {
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
          <div className="grid gap-4">
            <div className="grid gap-2 mb-4">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
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
                  to="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                placeholder="Usa al menos 6 caracteres"
                id="password"
                type="password"
                required
              />
            </div>
            <Button className="bg-indigo-400 text-black font-semibold hover:bg-indigo-500">
              Iniciar sesión
            </Button>
          </div>
          <div className="text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="underline">
              Registrate
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
