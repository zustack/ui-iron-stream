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
import { useMutation } from "@tanstack/react-query";
import { updateHistory } from "@/api/videos";

export default function Navbar() {
  const { logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const { changePage, resume, history_id } = useVideoResumeStore();

  // hacer el request aca
  // que nesesito? -> historyId & resumeState
  //
  // almacenar el videoRef.current.currentTime en el estado de
  // zustand(con un useEffect nuevo que se dispare cada vez que cambie el videoRef.current.currentTime)
  //
  // history id: video.history_id, se carga cada vez que pasa a otro video

  const updateHistoryMutation = useMutation({
    mutationFn: () => updateHistory(String(history_id), String(resume)),
  });

  const handleNavigation = (path: string) => {
    if (location.pathname.includes("video")) {
      console.log("foo");
      // esta saliendo del video y hay que cambiar el estado de zustand
      changePage(true);
      updateHistoryMutation.mutate();
      navigate(path);
      return;
      // update the history here
      // poner en course card = false
    }
    navigate(path);
  };

  return (
<header className="sticky top-0 flex h-16 items-center border-b bg-background px-4 md:px-6 z-10">
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
        <p className="text-red-400">resume: {resume}</p>
        <p className="text-blue-400">history_id: {history_id}</p>
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
              <DropdownMenuItem
                onClick={() => handleNavigation("/testing/hls")}
              >
                Hls
              </DropdownMenuItem>
              <DropdownMenuItem>Historial</DropdownMenuItem>
              <DropdownMenuItem>Configuraciones</DropdownMenuItem>
              <DropdownMenuItem>Feedback</DropdownMenuItem>
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
