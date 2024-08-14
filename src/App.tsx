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
import Notes from "./pages/notes";
import ResetPassword from "./pages/auth/reset-password";
import AdminCourses from "./pages/admin/courses";
import AdminVideos from "./pages/admin/videos";

import WindowFiles from "./components/admin/videos/window-files";
import AdminApps from "./pages/admin/apps";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route path="notes" element={<Notes />} />  
          
          <Route path="/" element={<Layout />}>
            <Route element={<PrivateRoute />}>
            <Route path="home" element={<Home />} />  
            <Route path="video/:courseId" element={<Video />} />  
          </Route>
        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="videos/:courseId/:courseTitle" element={<AdminVideos />} />
          <Route path="apps" element={<AdminApps />} />
        </Route>

        <Route path="new/window/admin/videos/files/:videoId" element={<WindowFiles />} />
        <Route element={<AdminRoute />}>
        </Route>

        <Route path="latter-admin" element={<AdminLayout />}>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
