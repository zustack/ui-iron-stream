import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import "./styles/spinner.css";
import "./styles/plyr.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();
const loadingSpinner = document.getElementById("spinner-start");

if (loadingSpinner) {
  loadingSpinner.style.display = "none";
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
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
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
