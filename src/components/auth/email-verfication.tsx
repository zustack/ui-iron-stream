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
import { resendEmail, verifyAccount } from "@/api/users";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import Logo from "../../assets/logo.png";
import Spinner from "../ui/spinner";

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

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <div className="grid gap-2 text-center">
            <h3 className="bold scroll-m-20 text-3xl tracking-tight">
              Verify your email address
            </h3>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Enter the code sent to your email address {email}. It may be in
              your spam folder.
            </p>
          </div>

          <form className="grid gap-4 justify-center">
            {verifyEmailMutation.isPending ? (
              <div className="flex justify-center items-center">
                <Spinner />
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

          <div className="flex justify-center gap-1 text-center items-center">
            <p>Didn't receive the code? </p>
            {resendEmailMutation.isPending ? (
              <Spinner />
            ) : (
              <p
                onClick={() => {
                  if (verifyEmailMutation.isPending) {
                    return;
                  }
                  resendEmailMutation.mutate();
                }}
                className={`${verifyEmailMutation.isPending ? 
                  "cursor-not-allowed" : "cursor-pointer hover:text-blue-500"}
                underline text-blue-600`}
              >
                Resend code
              </p>
            )}
          </div>

          <div className="flex justify-center gap-1 text-center">
            <p>Wrong email? </p>
            <p
              onClick={() => close()}
                className={`${verifyEmailMutation.isPending ? 
                  "cursor-not-allowed" : "cursor-pointer hover:text-blue-500"}
                underline text-blue-600`}
            >
              Change it
            </p>
          </div>
        </div>
      </div>
      <div
        className="flex flex-1 min-h-screen items-center 
        justify-center border-l border-dashed border-zinc-700"
      >
        <img src={Logo} className="w-[60%] h-auto" alt="Company Logo image" />
      </div>
    </div>
  );
}
