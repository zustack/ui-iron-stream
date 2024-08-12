import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link, useNavigate } from "react-router-dom";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuthStore } from "@/store/auth";
import { useMutation } from "@tanstack/react-query";
import { requestEmailTokenResetPassword, resendEmail, updatePassword, verifyAccount } from "@/api/users";
import { ErrorResponse } from "@/types";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [emailToken, setEmailToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);

  const { setAuthState } = useAuthStore();
  const navigate = useNavigate();

  // resend email mutation
  const resendEmailMutation = useMutation({
    mutationFn: () => requestEmailTokenResetPassword(email),
    onSuccess: () => {
      toast.success("Te enviamos un codigo a " + email);
      setStep(2);
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  // verify email token mutation
  const verifyEmailMutation = useMutation({
    mutationFn: () => verifyAccount(email, Number(emailToken)),
    onSuccess: (response) => {
      setAuthState(
        response.token,
        response.user_id,
        response.is_admin,
        response.exp
      );
      setStep(3);
      // navigate("/home");
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  // update password
  const updatePasswordMutation = useMutation({
    mutationFn: () => updatePassword(password),
    onSuccess: () => {
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
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    updatePasswordMutation.mutate();
  };

  if (step == 3) {
    return (
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-full max-w-sm gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold mb-6">Cambia tu contraseña</h1>
              <p className="text-balance text-muted-foreground mb-4">
                Ingresa tu nueva contraseña.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2 mb-4">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>

                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  required
                  id="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                className="bg-indigo-400 text-black font-semibold hover:bg-indigo-500"
              >
                Cambiar contraseña
              </Button>
            </form>
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

  if (step == 2) {
    return (
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-full max-w-sm gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold mb-6">Recuperar contraseña</h1>
              <p className="text-balance text-muted-foreground mb-4">
                Ingresa el código enviado a{" "}
                <span className="text-zinc-100 font-semibold">{email}</span>
              </p>
            </div>

            <form className="grid gap-4 justify-center">
              {verifyEmailMutation.isPending ? (
                <div className="flex justify-center items-center">
                  <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                </div>
              ) : (
                <InputOTP
                  maxLength={6}
                  value={emailToken}
                  onChange={(emailToken) => {
                    setEmailToken(emailToken);
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
            </form>

            <div className="text-center text-sm">
              ¿No recibiste el código?{" "}
              <Link to="/login" className="underline">
                Volver a enviar
              </Link>
            </div>

            <div className="text-center text-sm">
              ¿Correo electrónico incorrecto?{" "}
              <Link to="/register" className="underline">
                Cambialo
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

  if (step == 1) {
    return (
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-full max-w-sm gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold mb-6">Recuperar contraseña</h1>
              <p className="text-balance text-muted-foreground mb-4">
                Ingresa tu correo electrónico para recuperar tu cuenta.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                resendEmailMutation.mutate();
              }}
              className="grid gap-4"
            >
              <div className="grid gap-2 mb-4">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="ejemplo@gmail.com"
                  required
                />
              </div>
              <Button
                className=""
                type="submit"
                disabled={resendEmailMutation.isPending}
              >
                {resendEmailMutation.isPending ? (
                  <Loader className="h-6 w-6 text-zinc-900 animate-spin slower items-center flex justify-center" />
                ) : (
                  <span>Enviar código</span>
                )}
              </Button>
            </form>
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
}
