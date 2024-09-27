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
import { resendEmail, updatePassword, verifyAccount } from "@/api/users";
import { ErrorResponse } from "@/types";
import toast from "react-hot-toast";
import Logo from "../../assets/logo.png";
import Spinner from "@/components/ui/spinner";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [emailToken, setEmailToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);

  const { setAuthState } = useAuthStore();
  const navigate = useNavigate();

  const resendEmailMutation = useMutation({
    mutationFn: () => resendEmail(email),
    onSuccess: () => {
      setStep(2);
      toast.success("New code sent to " + email);
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

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
      setStep(3);
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: () => updatePassword(password),
    onSuccess: () => {
      navigate("/home");
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
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
              <h3 className="bold scroll-m-20 text-3xl tracking-tight">
                Enter your new password
              </h3>
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                Must be at least 8 characters long.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2 mb-4">
                <div className="flex items-center">
                  <Label htmlFor="password">New password</Label>
                </div>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={updatePasswordMutation.isPending}
                  required
                  id="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid gap-2 mb-4">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm your new password</Label>
                </div>
                <PasswordInput
                  required
                  disabled={updatePasswordMutation.isPending}
                  id="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button
                disabled={updatePasswordMutation.isPending}
                className="button-md flex gap-2 bg-blue-600 hover:bg-blue-500 text-white"
                type="submit"
              >
                <span>Update password</span>
                {updatePasswordMutation.isPending && <Spinner />}
              </Button>
            </form>
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

  if (step == 2) {
    return (
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-full max-w-sm gap-6">
            <div className="grid gap-2 text-center">
              <h3 className="bold scroll-m-20 text-3xl tracking-tight">
                Recover your account
              </h3>
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                Enter the code sent to {email}
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
                  className={`${verifyEmailMutation.isPending ? "cursor-not-allowed" : "cursor-pointer hover:text-blue-500"}underline text-blue-600`}
                >
                  Resend code
                </p>
              )}
            </div>

            <div className="flex justify-center gap-1 text-center">
              <p>Wrong email? </p>
              <p
                onClick={() => {
                  if (verifyEmailMutation.isPending) {
                    return;
                  }
                  setEmail("");
                  setEmailToken("");
                  setStep(1);
                }}
                className={`${verifyEmailMutation.isPending ? "cursor-not-allowed" : "cursor-pointer hover:text-blue-500"}underline text-blue-600`}
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

  if (step == 1) {
    return (
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-full max-w-sm gap-6">
            <div className="grid gap-2 text-center">
              <h3 className="bold scroll-m-20 text-3xl tracking-tight">
                Recover your password
              </h3>
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                Enter your email address.
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
                <Label htmlFor="email">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  disabled={resendEmailMutation.isPending}
                  placeholder="Your email address"
                  required
                />
              </div>
              <Button
                type="submit"
                className="button-md flex gap-2 bg-blue-600 hover:bg-blue-500 text-white"
                disabled={resendEmailMutation.isPending}
              >
                <span>Next step</span>
                {resendEmailMutation.isPending && <Spinner />}
              </Button>
            </form>

            <div className="text-center">
              Go back to{" "}
              <Link
                to={
                  resendEmailMutation.isPending ? "/reset-password" : "/login"
                }
                className={`${resendEmailMutation.isPending ? "cursor-not-allowed" : "hover:text-blue-500"} underline text-blue-600`}
              >
                Login
              </Link>
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
}
