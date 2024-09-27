import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/ui/password-input";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { Command } from "@tauri-apps/api/shell";
import { platform } from "@tauri-apps/api/os";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorResponse } from "@/types";
import { signUp } from "@/api/users";
import EmailVerification from "@/components/auth/email-verfication";
import { Loader } from "lucide-react";
import Logo from "../../assets/logo.png";
import { getPolicy } from "@/api/policy";
import Spinner from "@/components/ui/spinner";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pc, setPc] = useState("");
  const [os, setOs] = useState("");
  const [success, setSuccess] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(true);

  useEffect(() => {
    async function getSerialNumber() {
      const platformName = await platform();
      let commandName: string = "";

      if (platformName === "darwin") {
        setOs("Mac");
        commandName = "serial-mac";
      } else if (platformName === "win32") {
        setOs("Windows");
        commandName = "serial-win";
      } else if (platformName === "linux") {
        setOs("Linux");
        commandName = "serial-linux";
      } else {
        toast.error("An unexpected error occurred.");
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
        const match = data.match(/Machine ID:\s*([a-f0-9]+)/);
        if (match) {
          const serial_number = match[1];
          setPc(serial_number);
        }
      }
    }
    getSerialNumber();
  }, []);

  const signUpMutation = useMutation({
    mutationFn: () => signUp(email, name, surname, password, pc, os),
    onSuccess: () => {
      setSuccess(true);
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
    if (!privacyPolicy) {
      toast.error("Please accept the privacy policy");
      return;
    }
    signUpMutation.mutate();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["policy"],
    queryFn: () => getPolicy(),
  });

  if (success) {
    return (
      <EmailVerification
        close={() => {
          setEmail("");
          setName("");
          setSurname("");
          setPassword("");
          setConfirmPassword("");
          setSuccess(false);
        }}
        email={email}
      />
    );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2 text-center">
            <h3 className="scroll-m-20 text-3xl tracking-tight">Sign up</h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Create a new account in Iron Stream
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2 mb-4">
              <Label htmlFor="email">Email address</Label>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={signUpMutation.isPending}
                id="email"
                type="email"
                placeholder="Your email address"
                required
              />
            </div>

            <div className="grid gap-2 mb-4">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                type="text"
                disabled={signUpMutation.isPending}
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Your first name"
                required
              />
            </div>

            <div className="grid gap-2 mb-4">
              <Label htmlFor="surname">Surname</Label>
              <Input
                id="surnmae"
                type="text"
                disabled={signUpMutation.isPending}
                onChange={(e) => setSurname(e.target.value)}
                value={surname}
                placeholder="Your surname"
                required
              />
            </div>

            <div className="grid gap-2 mb-4">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <PasswordInput
                onChange={(e) => setPassword(e.target.value)}
                disabled={signUpMutation.isPending}
                value={password}
                required
                id="password"
                placeholder="••••••••"
              />
            </div>

            <div className="grid gap-2 mb-4">
              <div className="flex items-center">
                <Label htmlFor="c-password">Confirm your password</Label>
              </div>
              <PasswordInput
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={signUpMutation.isPending}
                value={confirmPassword}
                required
                id="c-password"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={privacyPolicy}
                disabled={signUpMutation.isPending}
                onCheckedChange={(active: boolean) => setPrivacyPolicy(active)}
                id="privacy-policy"
              />
              <Label htmlFor="privacy-policy">
                Accept terms and conditions
              </Label>
              <AlertDialog>
                <AlertDialogTrigger 
                disabled={signUpMutation.isPending}
                className={`${signUpMutation.isPending ? "cursor-not-allowed" : "hover:text-blue-500"} underline text-blue-600`} >
                  Privacy Policy
                </AlertDialogTrigger>
                <AlertDialogContent>
                  {isLoading && <Spinner />}
                  {isError && <p>An unexpected error occurred.</p>}
                  <AlertDialogHeader>
                    {data?.map((p: any) => (
                      <>
                        {p.p_type === "title" && (
                          <AlertDialogTitle>
                            <h3>{p.content}</h3>
                          </AlertDialogTitle>
                        )}

                        {p.p_type === "li" && (
                          <AlertDialogDescription>
                            <li>
                              {p.content
                                .split(/(\*\*[^*]+\*\*)/g)
                                .map((part: string, i: number) =>
                                  part.startsWith("**") &&
                                  part.endsWith("**") ? (
                                    <span key={i} className="text-white">
                                      {part.slice(2, -2)}
                                    </span>
                                  ) : (
                                    <span key={i}>{part}</span>
                                  )
                                )}
                            </li>
                          </AlertDialogDescription>
                        )}

                        {p.p_type === "text" && (
                          <AlertDialogDescription>
                            {p.content
                              .split(/(\*\*[^*]+\*\*)/g)
                              .map((part: string, i: number) =>
                                part.startsWith("**") && part.endsWith("**") ? (
                                  <span key={i} className="text-white">
                                    {part.slice(2, -2)}
                                  </span>
                                ) : (
                                  <span key={i}>{part}</span>
                                )
                              )}
                          </AlertDialogDescription>
                        )}
                      </>
                    ))}
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="flex gap-2 bg-blue-600 hover:bg-blue-500 text-white">
                      Accept Privacy Policy
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Button
              type="submit"
              className="flex gap-2 bg-blue-600 hover:bg-blue-500 text-white"
              disabled={signUpMutation.isPending}
            >
              <span>Next</span>
              {signUpMutation.isPending && <Spinner />}
            </Button>
          </form>
          <div className="text-center">
            Have an account?{" "}
            <Link
              to={signUpMutation.isPending ? "/signup" : "/login"}
              className={`${signUpMutation.isPending ? 
                "cursor-not-allowed" : 
                "hover:text-blue-500"} 
              underline text-blue-600`} >
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
