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
import { CircleUser, Package2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHistory } from "@/api/videos";

export default function Navbar() {
  const { logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();

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
        resume: video.currentTime,
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
            className="flex gap-1 font-semibold text-xl text-foreground transition-colors hover:text-white cursor-pointer"
          >
            <Package2 className="h-6 w-6" />
            <span>Acme</span>
            <span>Inc</span>
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
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hola, Agustin Fricke</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Configuraciones</DropdownMenuItem>
                <DropdownMenuItem>Feedback</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleNavigation("/admin/users")}
                >
                  Users
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleNavigation("/admin/courses")}
                >
                  Cursos
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleNavigation("/admin/apps")}
                >
                  Apps
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    handleNavigation("/login");
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
