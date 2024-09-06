import { Routes, Route, useLocation } from "react-router-dom";
import { AdminRoute, PrivateRoute } from "./lib/private-routes";
import Layout from "./components/layouts/layout";
import AdminLayout from "./components/layouts/admin-layout";
import Landing from "./pages/landing";
import Home from "./pages/home";
import AdminUsers from "./pages/admin/users";
import Login from "./pages/auth/login";
import Video from "./pages/video";
import ResetPassword from "./pages/auth/reset-password";
import AdminCourses from "./pages/admin/courses";
import AdminVideos from "./pages/admin/videos";
import Preview from "./pages/preview";

import WindowFiles from "./components/admin/videos/window-files";
import AdminApps from "./pages/admin/apps";
import { platform } from "@tauri-apps/api/os";
import { useOsStore } from "./store/os";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateHistory } from "./api/videos";
import { appWindow } from "@tauri-apps/api/window";
import Files from "./pages/files";
import { Loader } from "lucide-react";
import Signup from "./pages/auth/signup";
import Reviews from "./pages/reviews";
import AdminReviews from "./pages/admin/reviews";
import AdminPolicy from "./pages/admin/policy";

function App() {
  const { setOs } = useOsStore();
  const location = useLocation();

  useEffect(() => {
    async function getPlaform() {
      const osSystem = await platform();
      setOs(osSystem);
    }
    getPlaform();
  }, []);

  const updateHistoryMutation = useMutation({
    mutationFn: ({
      resume,
      historyId,
    }: {
      resume: number;
      historyId: string;
    }) => updateHistory(historyId, String(resume)),
    onSettled: () => {
      appWindow.close();
    },
  });

  useEffect(() => {
    const unlisten = appWindow.listen("tauri://close-requested", async () => {
      if (location.pathname.includes("video")) {
        const video = document.getElementById("video") as HTMLMediaElement;
        const historyId = localStorage.getItem("historyId");
        updateHistoryMutation.mutate({
          resume: video.currentTime,
          historyId: historyId || "",
        });
      } else if (
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/reset-password" ||
        location.pathname.includes("files")
      ) {
        appWindow.close();
      } else {
        appWindow.close();
      }
    });
    return () => {
      unlisten.then((dispose) => dispose());
    };
  }, [location]);

  return (
    <>
      {updateHistoryMutation.isPending ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="w-8 h-8 animate-spin slower" />
        </div>
      ) : (
        <Routes>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route path="home" element={<Home />} />
              <Route path="reviews/:courseId" element={<Reviews />} />
              <Route path="video/:courseId" element={<Video />} />
              <Route path="preview/:courseId" element={<Preview />} />
            </Route>
            <Route
              path="files/:courseId/:videoId/:videoTitle"
              element={<Files />}
            />
          </Route>

          <Route path="admin" element={<AdminLayout />}>
            <Route path="users" element={<AdminUsers />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route
              path="videos/:courseId/:courseTitle"
              element={<AdminVideos />}
            />
            <Route path="apps" element={<AdminApps />} />
            <Route path="policy" element={<AdminPolicy />} />
            <Route
              path="files/:courseId/:courseTitle/:videoId/:videoTitle"
              element={<WindowFiles />}
            />
          </Route>

          <Route element={<AdminRoute />}></Route>

          <Route path="latter-admin" element={<AdminLayout />}></Route>
        </Routes>
      )}
    </>
  );
}

export default App;
