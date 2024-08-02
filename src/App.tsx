import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminRoute, PrivateRoute } from "./lib/private-routes";
import Layout from "./components/layouts/layout";
import AdminLayout from "./components/layouts/admin-layout";
import Landing from "./pages/landing";
import Home from "./pages/home";
import AdminUsers from "./pages/admin/users";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route path="home" element={<Home />} />  
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
