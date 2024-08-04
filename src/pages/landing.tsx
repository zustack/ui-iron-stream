import { Button } from "@/components/ui/button";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <section className="">
      <div
        className="grid max-w-screen-xl px-4 py-8 mx-auto 
    lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12"
      >
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-bold tracking-tight leading-none md:text-5xl xl:text-6xl text-zinc-200">
            Iron{" "} 
            <span className="text-indigo-400">
            Stream
            </span>
          </h1>
          <p className="max-w-2xl mb-6 text-muted-foreground lg:mb-8 md:text-lg lg:text-xl">
            Cursos orientados a estudiantes y profesionales para poder
            comprender y aplicar el conocimiento.
          </p>
          <div className="flex gap-4">
          <Link to="/home">
            <Button className="bg-indigo-400 text-black font-semibold hover:bg-indigo-500">Iniciar sesión</Button>
            </Link>

          <Link to="/register">
            <Button className="font-semibold">Crear cuenta</Button>
            </Link>
          </div>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src={Logo} alt="" />
        </div>
      </div>
    </section>
  );
}
