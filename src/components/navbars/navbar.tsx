import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { CircleUser, Eclipse } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHistory } from "@/api/videos";
import { logout as logoutRq } from "@/api/user_log";

export default function Navbar() {
  const { logout, isAdmin, fullName } = useAuthStore();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: () => logoutRq(),
    onSuccess: async () => {
      logout();
    }
  });

  const queryClient = useQueryClient();

  const updateHistoryMutation = useMutation({
    mutationFn: ({
      resume,
      historyId,
    }: {
      resume: number;
      historyId: string;
    }) => updateHistory(historyId, String(resume)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-video"] });
    },
  });

  const handleNavigation = (path: string) => {
    if (location.pathname.includes("video")) {
      const video = document.getElementById("video") as HTMLMediaElement;
      const historyId = localStorage.getItem("historyId");
      updateHistoryMutation.mutate({
        resume: video?.currentTime,
        historyId: historyId || "",
      });
      navigate(path);
      return;
    }
    navigate(path);
  };

  return (
    <header className="sticky top-0 flex h-[60px] items-center border-b bg-background px-4 md:px-6 z-10">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <button
            onClick={() => {
              handleNavigation("/home");
            }}
            className="flex gap-2 text-xl text-foreground"
          >
            <span>Iron</span>
            <span>Stream</span>
          </button>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[250px]" align="end">
                <DropdownMenuLabel>Hola, {fullName}</DropdownMenuLabel>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleNavigation("/admin/statistics")}
                    >
                      Admin panel
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    handleNavigation("/account");
                  }}
                >
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    logoutMutation.mutate()
                    navigate("/login");
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-muted-foreground">Version 4.2.0</p>
        </div>
      </div>
    </header>
  );
}
