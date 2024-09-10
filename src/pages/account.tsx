import {
  getCurrentUser,
  resendEmail,
  updatePassword,
  verifyAccount,
} from "@/api/users";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, Loader } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useState, ChangeEvent } from "react";
import LoadImage from "@/components/load-image";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function Account() {
  const [page, setPage] = useState(0);
  const [emailToken, setEmailToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getCurrentUser(),
  });

  const resendEmailMutation = useMutation({
    mutationFn: () => resendEmail(data?.email),
    onSuccess: () => {
      toast.success("New code sent to " + data?.email);
      setIsEmailSent(1);
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: () => verifyAccount(data?.email, Number(emailToken)),
    onSuccess: () => {
      updatePasswordMutation.mutate();
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
      setIsEmailSent(0);
      toast.success("Password updated successfully");
      setPassword("");
      setConfirmPassword("");
      setEmailToken("");
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  function submitChangePassword() {
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    resendEmailMutation.mutate();
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-11">
        <h1 className="text-2xl md:text-3xl font-semibold">Account Settings</h1>
      </div>
      <Separator className="mb-12" />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 w-full">
          <nav className="grid items-start text-sm font-medium">
            <button
              onClick={() => setPage(0)}
              className="flex items-center gap-3 py-2 text-muted-foreground rounded-lg transition-all hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Account settings
            </button>
            <button
              onClick={() => setPage(1)}
              className="flex items-center gap-3 py-2 text-muted-foreground rounded-lg transition-all hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Video history
            </button>
          </nav>
        </div>

        <div className="md:w-3/4 w-full">
          {page === 0 && (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {isLoading && <Loader className="h-5 w-5 animate-spin" />}
                    {isError && (
                      <p>Something went wrong. Please try again later.</p>
                    )}

                    {data && (
                      <>
                        <p>Email: {data?.email}</p>
                        <p>Name: {data?.name}</p>
                        <p>Surname: {data?.surname}</p>
                        <p>Created at: {data?.created_at}</p>

                        {isEmailSent === 1 ? (
                          <>
                            {verifyEmailMutation.isPending ||
                            updatePasswordMutation.isPending ? (
                              <div className="flex justify-center items-center">
                                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                              </div>
                            ) : (
                              <>
                              <Label>
                                A new code has been sent to {data?.email}
                              </Label>
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
                              </>
                            )}
                          </>
                        ) : (
                          <form
                            onSubmit={submitChangePassword}
                            className="flex flex-col gap-2"
                          >
                            <p>Update your current password</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <PasswordInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="New password"
                                className="w-full"
                              />
                              <PasswordInput
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm new password"
                                className="w-full"
                              />
                            </div>
                          </form>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
                {isEmailSent === 0 && (
                  <CardFooter className="border-t px-6 py-4 flex justify-end">
                    <Button
                      disabled={resendEmailMutation.isPending}
                      className="flex gap-2"
                      onClick={() => {
                        submitChangePassword();
                      }}
                    >
                      {resendEmailMutation.isPending && (
                        <Loader className="h-6 w-6 text-zinc-900 animate-spin slower" />
                      )}
                      Update password
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          )}

          {page === 1 && (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video history</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-6">
                      <div className="col-span-2">
                        <LoadImage
                          cn="rounded-[0.75rem]"
                          src={
                            "http://localhost:8081/web/uploads/thumbnails/1492331a-060b-4a3c-8cc8-55d72ff18450.png"
                          }
                        />
                      </div>
                      <div className="col-span-4">
                        <div className="flex flex-col gap-[15px] mx-2 py-1">
                          <h4 className="font-semibold">
                            CloudFront Signed URLs with Node.js
                          </h4>
                          <p className="text-sm text-zinc-200">
                            Create signed urls to access files in a CloudFront
                            distribution. Learn how to generate the signed URLs
                            using a private key in a node application.
                          </p>
                          <div className="flex gap-2">
                            <p className="text-sm text-zinc-400">4 hours</p>
                            <p className="text-sm text-zinc-400">•</p>
                            <p className="text-sm text-zinc-400">69 views</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-6">
                      <div className="col-span-2">
                        <LoadImage
                          cn="rounded-[0.75rem]"
                          src={
                            "http://localhost:8081/web/uploads/thumbnails/1492331a-060b-4a3c-8cc8-55d72ff18450.png"
                          }
                        />
                      </div>
                      <div className="col-span-4">
                        <div className="flex flex-col gap-[15px] mx-2 py-1">
                          <h4 className="font-semibold">
                            CloudFront Signed URLs with Node.js
                          </h4>
                          <p className="text-sm text-zinc-200">
                            Create signed urls to access files in a CloudFront
                            distribution. Learn how to generate the signed URLs
                            using a private key in a node application.
                          </p>
                          <div className="flex gap-2">
                            <p className="text-sm text-zinc-400">4 hours</p>
                            <p className="text-sm text-zinc-400">•</p>
                            <p className="text-sm text-zinc-400">69 views</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
