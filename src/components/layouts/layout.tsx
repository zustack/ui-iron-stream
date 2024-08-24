import { Outlet } from "react-router-dom";
import Navbar from "../navbars/navbar";

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}
