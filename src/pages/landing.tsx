import { Button } from "@/components/ui/button";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

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
            className="max-w-2xl mb-4 text-4xl ont-bold tracking-tight 
                         leading-none md:text-5xl xl:text-6xl text-zinc-200"
          >
            Iron <span className="text-indigo-400">Stream</span>
          </h1>
          <p className="max-w-2xl mb-6 text-muted-foreground lg:mb-8">
            Courses aimed at students and professionals to help them understand
            and apply knowledge.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/login")}>Login to your account</Button>
            <Button 
            variant={"outline"}
            onClick={() => navigate("/signup")}>Create a new account</Button>
          </div>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src={Logo} alt="" />
        </div>
      </div>
    </section>
  );
}
