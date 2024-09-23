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
import {
  resendEmail,
  updatePassword,
  verifyAccount,
} from "@/api/users";
import { ErrorResponse } from "@/types";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import Logo from "../../assets/logo.png";

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
      toast.error("Passwords do not match");
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
              <h1 className="text-3xl font-bold mb-6">Update your password</h1>
              <p className="text-balance text-muted-foreground mb-4">
                Create your new password.
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
                  id="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
              >
                Update password
              </Button>
            </form>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <img src={Logo} alt="Login image" />
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
              <h1 className="text-3xl font-bold mb-6">Recover your account</h1>
              <p className="text-balance text-muted-foreground mb-4">
                Enter the code sent to{" "}
                <span className="text-zinc-100 font-semibold">{email}</span>.
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
            <p>Wrong email? </p>
              <p
                onClick={() => {
                  setEmail("")
                  setEmailToken("")
                  setStep(1); 
                }}
                className="underline cursor-pointer"
              >
                Change it
              </p>
          </div>

          </div>
        </div>
        <div className="hidden bg-zinc-900 lg:block">
          <img src={Logo} alt="Login image" />
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
              <h1 className="text-3xl font-bold mb-6">Recover your account</h1>
              <p className="text-balance text-muted-foreground mb-4">
                Enter your email address to recover your account.
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
                  placeholder="Your email address"
                  required
                />
              </div>
              <Button
                type="submit"
                className="flex gap-2"
                disabled={resendEmailMutation.isPending}
              >
                {resendEmailMutation.isPending && (
                  <Loader className="h-6 w-6 text-zinc-900 animate-spin slower" />
                )}
                <span>Next step</span>
              </Button>
            </form>

          <div className="text-center">
            Go back to {" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </div>

          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <img src={Logo} alt="Login image" />
        </div>
      </div>
    );
  }
}
