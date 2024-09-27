import { Button } from "@/components/ui/button";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { ChevronRight, UserPlus } from "lucide-react";

export default function Landing() {
  const { isAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/home");
    }
  }, []);

  return (
    <section className="">
      <div
        className="
        grid max-w-screen-xl px-4 py-8 mx-auto 
        lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12"
      >
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1
            className="max-w-2xl mb-4 text-4xl bold tracking-tight 
            md:text-5xl xl:text-6xl text-zinc-200"
          >
            Iron <span className="text-blue-600">Stream</span>
          </h1>
          <p className="max-w-2xl mb-6 text-xl text-muted-foreground lg:mb-8">
            Desktop application that implements highly effective DRM solutions
            to safeguard multimedia content.
          </p>
          <div className="flex gap-4">
            <Button
              className="flex button-md gap-2 bg-blue-600 hover:bg-blue-500 text-white"
              onClick={() => navigate("/login")}
            >
              Sign in
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button 
            className="flex gap-2 button-md"
            onClick={() => navigate("/signup")}>
              Create account
              <UserPlus className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src={Logo} alt="Company Logo image" />
        </div>
      </div>
    </section>
  );
}
