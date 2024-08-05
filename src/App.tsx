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

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />  
          <Route path="video/:courseId" element={<Video />} />  
          </Route>
          <Route path="notes" element={<Notes />} />  
          
          <Route path="/" element={<Layout />}>
          <Route element={<PrivateRoute />}>
          </Route>
        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route element={<AdminRoute />}>
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
