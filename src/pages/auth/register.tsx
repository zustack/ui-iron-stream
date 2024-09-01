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
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "@/types";
import { signUp } from "@/api/users";
import EmailVerification from "@/components/auth/email-verfication";
import { Loader } from "lucide-react";
import Logo from "../../assets/logo.png";

export default function Register() {
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
        toast.error("Ocurrio un error");
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
        setPc(data);
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
    signUpMutation.mutate();
  };

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
            <h1 className="text-3xl font-bold mb-6">Sign up</h1>
            <p
              onClick={() => setSuccess(true)}
              className="text-balance text-muted-foreground mb-4"
            >
              Create a new account in Iron Stream
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2 mb-4">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
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
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Your first name"
                required
              />
            </div>

            <div className="grid gap-2 mb-4">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                type="text"
                onChange={(e) => setSurname(e.target.value)}
                value={surname}
                placeholder="Your last name"
                required
              />
            </div>

            <div className="grid gap-2 mb-4">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <PasswordInput
                onChange={(e) => setPassword(e.target.value)}
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
                value={confirmPassword}
                required
                id="c-password"
                placeholder="••••••••"
              />
            </div>

            <div className="items-top flex space-x-2 mb-4">
              <Checkbox
                checked={privacyPolicy}
                onCheckedChange={(active: boolean) => setPrivacyPolicy(active)}
                id="privacy-policy"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="privacy-policy"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed 
          peer-disabled:opacity-70"
                >
                  By continuing you agree to our{" "}
                  <AlertDialog>
                    <AlertDialogTrigger className="underline">
                      Privacy Policy
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Privacy Policy</AlertDialogTitle>
                        <AlertDialogDescription>
                          With less than a month to go before the European Union
                          enacts new consumer privacy laws for its citizens,
                          companies around the world are updating their terms of
                          service agreements to comply.
                        </AlertDialogDescription>

                        <AlertDialogDescription>
                          The European Union’s General Data Protection
                          Regulation (G.D.P.R.) goes into effect on May 25 and
                          is meant to ensure a common set of data rights in the
                          European Union. It requires organizations to notify
                          users as soon as possible of high-risk data breaches
                          that could personally affect them.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </label>
              </div>
            </div>
            <Button 
            type="submit"
            className="flex gap-2" disabled={signUpMutation.isPending}>
              {signUpMutation.isPending && (
                <Loader className="h-6 w-6 text-zinc-900 animate-spin slower" />
              )}
              <span>Create account</span>
            </Button>
          </form>

          <div className="text-center text-sm">
            Have an account?{" "}
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
