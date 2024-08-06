import { Home as H, Package, Package2, Pickaxe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
      : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
  };

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            to="/"
            className="flex gap-1 font-semibold text-xl text-foreground transition-colors hover:text-white"
          >
            <span>Admin</span>
            <span>panel</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-y-2">
            <Link to="/home" className={getLinkClass("/generate-image")}>
              <Pickaxe className="h-4 w-4" />
              Cursos
            </Link>
            <Link to="/admin/users" className={getLinkClass("/admin/users")}>
              <Package className="h-4 w-4" />
              Usuarios
            </Link>

            <Link to="/" className={getLinkClass("/")}>
              <H className="h-4 w-4" />
              Apps
            </Link>

            <Link to="/" className={getLinkClass("/")}>
              <H className="h-4 w-4" />
              Historial
            </Link>

            <Link to="/" className={getLinkClass("/")}>
              <H className="h-4 w-4" />
              <span className="font-semibold text-xs text-indigo-400">
                Reseñas
              </span>
              <span className="ml-auto font-semibold text-xs text-indigo-400">
                2
              </span>
            </Link>
          </nav>
        </div>

        <div className="p-4 grid items-start px-2 text-sm font-medium lg:px-4 gap-y-2">
            <Link to="/" className={getLinkClass("/")}>
              <H className="h-4 w-4" />
                Configuraciones 
            </Link>

            <Link to="/" className={getLinkClass("/")}>
              <H className="h-4 w-4" />
                Logout
            </Link>
          <p className="text-sm text-muted-foreground flex items-center 
          gap-3 rounded-lg px-3 py-2">Version 4.2.0</p>
        </div>

      </div>
    </div>
  );
}
