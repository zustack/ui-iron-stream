import { getNotifications } from "@/api/notifications";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import {
  AppWindow,
  ChartNoAxesCombined,
  GalleryVerticalEnd,
  Home as H,
  Handshake,
  ListVideo,
  Loader,
  LogOut,
  Star,
  User,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
  });

  useEffect(() => {
    if (data) {
      const userInfo = JSON.stringify(data.info_u);
      localStorage.setItem("user_n", userInfo);

      const reviewInfo = JSON.stringify(data.info_r);
      localStorage.setItem("review_n", reviewInfo);
    }
  }, [data]);

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
      : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
  };

  return (
    <div className="hidden bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <button
            className="flex bold gap-1 text-2xl text-foreground transition-colors hover:text-white"
          >
            <span>Iron</span>
            <span>Stream</span>
          </button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-y-2">
            <Link to="/home" className={getLinkClass("/home")}>
              <H className="h-4 w-4" />
              Home
            </Link>

            <Link to="/admin/users" className={getLinkClass("/admin/users")}>
              <User
                className={
                  data?.user_n > 0 ? `h-4 w-4 text-indigo-400` : `h-4 w-4`
                }
              />
              <span className={data?.user_n > 0 ? `text-indigo-400` : ``}>
                Users
              </span>
              {isLoading && (
                <Loader className="ml-auto h-4 w-4 text-zinc-200 animate-spin slower" />
              )}
              {data?.user_n > 0 && (
                <span className="ml-auto text-indigo-400">{data?.user_n}</span>
              )}
            </Link>

            <Link to="/admin/apps" className={getLinkClass("/admin/apps")}>
              <AppWindow className="h-4 w-4" />
              Apps
            </Link>

            <Link
              to="/admin/reviews"
              className={getLinkClass("/admin/reviews")}
            >
              <Star
                className={
                  data?.review_n > 0 ? `h-4 w-4 text-indigo-400` : `h-4 w-4`
                }
              />
              <span className={data?.review_n > 0 ? `text-indigo-400` : ``}>
                Reviews
              </span>
              {isLoading && (
                <Loader className="ml-auto h-4 w-4 text-zinc-200 animate-spin slower" />
              )}
              {data?.review_n > 0 && (
                <span className="ml-auto text-indigo-400">
                  {data?.review_n}
                </span>
              )}
            </Link>

            <Link
              to="/admin/courses"
              className={getLinkClass("/admin/courses")}
            >
              <ListVideo className="h-4 w-4" />
              Courses
            </Link>

            <Link to="/admin/policy" className={getLinkClass("/admin/policy")}>
              <Handshake className="h-4 w-4" />
              Privacy Policy
            </Link>

            <Link
              to="/admin/log"
              className={getLinkClass("/admin/log")}
            >
              <GalleryVerticalEnd className="h-4 w-4" />
                Logs
            </Link>

            <Link
              to="/admin/statistics"
              className={getLinkClass("/admin/statistics")}
            >
              <ChartNoAxesCombined className="h-4 w-4" />
                Statistics
            </Link>
          </nav>
        </div>

        <div className="p-4 grid items-start px-2 text-sm font-medium lg:px-4 gap-y-2">
          <button
            onClick={() => {
              navigate("/");
              logout();
            }}
            className={getLinkClass("/")}
          >
            <LogOut className="h-4 w-4"/>
            Logout
          </button>
          <p
            className="text-sm text-muted-foreground flex items-center 
          gap-3 rounded-lg px-3 py-2"
          >
            Version 4.2.0
          </p>
        </div>
      </div>
    </div>
  );
}
