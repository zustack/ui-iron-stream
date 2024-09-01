import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "@/types";
import {
  deleteAccountByEmail,
  resendEmail,
  verifyAccount,
} from "@/api/users";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import { Loader } from "lucide-react";
import Logo from "../../assets/logo.png";

export default function EmailVerification({
  email,
  close,
}: {
  email: string;
  close: () => void;
}) {
  const [emailToken, setEmailToken] = useState("");

  const { setAuthState } = useAuthStore();
  const navigate = useNavigate();

  const verifyEmailMutation = useMutation({
    mutationFn: () => verifyAccount(email, Number(emailToken)),
    onSuccess: (response) => {
      setAuthState(
        response.token,
        response.userId,
        response.isAdmin,
        response.exp,
        response.fullName
      );
      navigate("/home");
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const resendEmailMutation = useMutation({
    mutationFn: () => resendEmail(email),
    onSuccess: () => {
      toast.success("New code sent to " + email);
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const deleteAccountByEmailMutation = useMutation({
    mutationFn: () => deleteAccountByEmail(email),
    onSuccess: () => {
      close();
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold mb-6">
              Verify your email address
            </h1>
            <p className="text-balance text-muted-foreground mb-4">
              Enter the code sent to your email address{" "}
              <span className="text-zinc-100 font-semibold">{email}</span> ,
              could be in your spam folder.
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
            </div>
          </form>

          <div className="flex justify-center gap-1 text-center text-sm">
            <p>Didn't receive the code? </p>

            {resendEmailMutation.isPending ? (
              <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
            ) : (
              <p
                onClick={() => resendEmailMutation.mutate()}
                className="underline cursor-pointer"
              >
                Resend code
              </p>
            )}
          </div>

          <div className="flex justify-center gap-1 text-center text-sm">
            <p>Discard account and</p>

            {deleteAccountByEmailMutation.isPending ? (
              <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
            ) : (
              <p
                onClick={() => deleteAccountByEmailMutation.mutate()}
                className="underline cursor-pointer"
              >
              create a new one
              </p>
            )}
          </div>

        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img src={Logo} alt="Login image" />
      </div>
    </div>
  );
}
