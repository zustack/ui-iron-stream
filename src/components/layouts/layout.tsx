import { Outlet } from "react-router-dom";
import Navbar from "../navbars/navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="mt-[20px]">
        <Outlet />
      </div>
    </>
  );
}
