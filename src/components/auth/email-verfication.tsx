import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "@/types";
import { deleteAccountAtRegister, resendEmail, verifyAccount } from "@/api/users";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import { Loader } from "lucide-react";

export default function EmailVerification({ email, close }: { email: string, close: () => void }) {
  const [emailToken, setEmailToken] = useState("");

  const { setAuthState } = useAuthStore();
  const navigate = useNavigate()

  const verifyEmailMutation = useMutation({
    mutationFn: () => verifyAccount(email, Number(emailToken)),
    onSuccess: (response) => {
      setAuthState(response.token, response.user_id, response.is_admin, response.exp);
      navigate("/home");
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  const resendEmailMutation = useMutation({
    mutationFn: () => resendEmail(email),
    onSuccess: () => {
      toast.success("Nuevo codigo enviado a " + email);
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  // 2 mutation: send new code to email()
  // 3 mutation: datos incorrectos, eliminar el usuario creado y volver a register
  const deleteAccountAtRegisterMutation = useMutation({
    mutationFn: () => deleteAccountAtRegister(email),
    onSuccess: () => {
      close()
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold mb-6">Verificar cuenta</h1>
            <p className="text-balance text-muted-foreground mb-4">
              Ingresa el código enviado a <span className="text-zinc-100 font-semibold">{email}.</span>
              {" "}Puede estar en la carpeta de SPAM
            </p>
          </div>

          <form className="grid gap-4 justify-center">
          <div className="mb-4">
              {verifyEmailMutation.isPending ? (
              <div className="flex justify-center items-center">
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              </div>
              ) : (
              <InputOTP
                maxLength={6}
                value={emailToken}
                onChange={(emailToken) => {
                  setEmailToken(emailToken)
                  if (emailToken.length === 6) {
                    verifyEmailMutation.mutate();
                  }
                }}
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

              )}
              </div>

          </form>

          <div className="text-center text-sm">
            ¿No recibiste el código?{" "}
            <p  
            onClick={() => resendEmailMutation.mutate()}
            className="underline">
              {resendEmailMutation.isPending ? "Enviando..." : "Reenviar"}
            </p>
          </div>

          <div className="text-center text-sm">
            ¿Datos incorrectos?{" "}
            <p  
            onClick={() => deleteAccountAtRegisterMutation.mutate()}
            className="underline">
              {deleteAccountAtRegisterMutation.isPending ? <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" /> : "Volver al registro"}
            </p>
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
