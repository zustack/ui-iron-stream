import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Command } from "@tauri-apps/api/shell";
import { platform } from "@tauri-apps/api/os";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/users";
import { useAuthStore } from "@/store/auth";
import { ErrorResponse } from "@/types";
import Logo from "../../assets/logo.png";
import { PasswordInput } from "@/components/ui/password-input";
import Spinner from "@/components/ui/spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pc, setPc] = useState("");

  const { setAuthState } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function getSerialNumber() {
      const platformName = await platform();
      let commandName: string = "";

      if (platformName === "darwin") {
        commandName = "serial-mac";
      } else if (platformName === "win32") {
        commandName = "serial-win";
      } else if (platformName === "linux") {
        commandName = "serial-linux";
      } else {
        toast.error(
          "An unexpected error occurred trying to get the unique identifier."
        );
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

  const loginMutation = useMutation({
    mutationFn: () => login(email, password, pc),
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2 text-center">
            <h3 className="scroll-m-20 bold text-3xl tracking-tight">Login</h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Login to your Iron Stream account.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
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
                disabled={loginMutation.isPending}
                required
              />
            </div>
            <div className="grid gap-2 mb-4">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to={loginMutation.isPending ? "/login" : "/reset-password"}
                  className="ml-auto inline-block underline text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
              <PasswordInput
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={loginMutation.isPending}
                required
                id="password"
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              className="button-md flex gap-2 bg-blue-600 hover:bg-blue-500 text-white"
              disabled={loginMutation.isPending}
            >
              <span>Login</span>
              {loginMutation.isPending && (
                <Spinner />
              )}
            </Button>
          </form>

          <p className="text-center">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="underline text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </p>
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
