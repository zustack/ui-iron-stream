import { Outlet } from "react-router-dom";
import Navbar from "../navbars/navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-[50px]">
        <Outlet />
      </div>
    </>
  );
}
