import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function EmailVerification({ email }: { email: string }) {
  const [token, setToken] = useState("");

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold mb-6">Verificar cuenta</h1>
            <p className="text-balance text-muted-foreground mb-4">
              Ingresa el código enviado a <span className="text-zinc-100 font-semibold">{email}</span>
            </p>
          </div>

          <form className="grid gap-4 flex justify-center">
          <div className="mb-4">
              <InputOTP
                maxLength={6}
                value={token}
                onChange={(token) => setToken(token)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              </div>

            <Button className="bg-indigo-400 text-black font-semibold hover:bg-indigo-500 mb-4">
              Verificar cuenta
            </Button>
          </form>

          <div className="text-center text-sm">
            ¿No recibiste el código?{" "}
            <Link to="/login" className="underline">
              Volver a enviar 
            </Link>
          </div>

          <div className="text-center text-sm">
            ¿Datos incorrectos?{" "}
            <Link to="/register" className="underline">
              Volver a registro
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
