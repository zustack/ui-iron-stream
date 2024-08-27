import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminRoute, PrivateRoute } from "./lib/private-routes";
import Layout from "./components/layouts/layout";
import AdminLayout from "./components/layouts/admin-layout";
import Landing from "./pages/landing";
import Home from "./pages/home";
import AdminUsers from "./pages/admin/users";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
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

function App() {
  // make this with localStorage
  const { setOs } = useOsStore();

  useEffect(() => {
    async function getPlaform() {
      const osSystem = await platform();
      setOs(osSystem);
    }
    getPlaform();
  }, []);

  // const { resume, history_id } = useVideoResumeStore();

  const updateHistoryMutation = useMutation({
    mutationFn: () => updateHistory("history_id", "resume"),
    onSettled: () => {
      appWindow.close();
    }
  });

  useEffect(() => {
    // if location is === '/login' or '/register' or '/reset-password' or '/files' do not listen
    // if location is === '/video' listen for updateHistoryMutation && logout && close requested
    // if location is !== '/video' listen for logout && close requested
    const unlisten = appWindow.listen("tauri://close-requested", async () => {
      updateHistoryMutation.mutate();
      console.log("mut executed");
    });

    // Cleanup the listener when the component is unmounted
    return () => {
      unlisten.then((dispose) => dispose());
    };
  }, []);

  return (
    <>
    {updateHistoryMutation.isPending ? (
      <div className="text-red-500 text-4xl">
        Loading to close!
      </div>
    ) : (
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="reset-password" element={<ResetPassword />} />

        <Route path="/" element={<Layout />}>
          <Route element={<PrivateRoute />}>
            <Route path="home" element={<Home />} />
            <Route path="video/:courseId" element={<Video />} />
            <Route path="preview/:courseId" element={<Preview />} />
          </Route>
        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route
            path="videos/:courseId/:courseTitle"
            element={<AdminVideos />}
          />
          <Route path="apps" element={<AdminApps />} />
        </Route>

        <Route
          path="new/window/admin/videos/files/:videoId"
          element={<WindowFiles />}
        />
        <Route element={<AdminRoute />}></Route>

        <Route path="latter-admin" element={<AdminLayout />}></Route>
      </Routes>
    </BrowserRouter>
    )}
    </>
  );
}

export default App;
