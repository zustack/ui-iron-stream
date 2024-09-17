import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "../navbars/sidebar";

export default function AdminLayout() {
  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 10000,
          style: {
            background: "#27272A",
            color: "#E4E4E7",
            borderRadius: "13px",
          },
        }}
      />
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <Outlet />
        </div>
      </div>
    </>
  );
}
