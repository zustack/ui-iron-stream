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
import { useVideoResumeStore } from "@/store/video-resume";

export default function Navbar() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const { changePage } = useVideoResumeStore()

  const handleNavigation = (path: string) => {
    if (location.pathname.includes("video")) {
      console.log("foo")
      // esta saliendo del video y hay que cambiar el estado de zustand
      changePage(true)
      // poner en course card = false
    }
    navigate(path);
  };

  return (
    <header className="sticky top-0 flex h-16 items-center border-b bg-background px-4 md:px-6">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <a
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/");
            }}
            href="/"
            className="flex gap-1 font-semibold text-xl text-foreground transition-colors hover:text-white cursor-pointer"
          >
            <Package2 className="h-6 w-6" />
            <span>Acme</span>
            <span>Inc</span>
          </a>
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
                <DropdownMenuItem
                  onClick={() => handleNavigation("/admin/courses")}
                >
                  Cursos
                </DropdownMenuItem>
                <DropdownMenuItem>Historial</DropdownMenuItem>
                <DropdownMenuItem>Configuraciones</DropdownMenuItem>
                <DropdownMenuItem>Feedback</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (isVideoPage) {
                      console.log("hello");
                      changePage();
                    }
                    logout();
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
