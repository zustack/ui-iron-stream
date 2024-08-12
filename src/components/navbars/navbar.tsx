import { Link } from "react-router-dom";
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

export default function Navbar() {

  const { logout } = useAuthStore()

  return (
    <header className="sticky top-0 flex h-16 items-center border-b bg-background px-4 md:px-6">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="/"
            className="flex gap-1 font-semibold text-xl text-foreground transition-colors hover:text-white"
          >
            <Package2 className="h-6 w-6" />
            <span>Acme</span>
            <span>Inc</span>
          </Link>
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
                <Link to="/admin/courses">
                <DropdownMenuItem>
                  Cursos 
                </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Historial</DropdownMenuItem>
                <DropdownMenuItem>Configuraciones</DropdownMenuItem>
                <DropdownMenuItem>Feedback</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                onClick={() => logout()}
                >Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-muted-foreground">Version 4.2.0</p>
        </div>
      </div>
    </header>
  );
}
