import { Link } from "react-router-dom";
import Image from "../assets/image.png";
import { Button } from "./ui/button";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

export default function CourseCard() {
  return (
    <div className="bg-zinc-950 rounded-[0.75rem] grid grid-cols-2 min-h-[300px] border">
      <img src={Image} alt="" className="p-1 rounded-[0.75rem]" />
      <div className="flex flex-col justify-between p-4">
        <div>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight leading-none text-zinc-200 mb-6">
            go & htmx
          </h1>

          <p className="max-w-2xl text-zinc-200 mb-4">
            Creado por @agustfricke
          </p>

          <p className="max-w-2xl text-zinc-200 mb-4">
            Are you wanting an alternative to complicated UI frameworks? Make
            web app development simpler using HTMX! Using Go, you’ll build a
            simple server to respond to routes with templates. Then enhance your
            HTML with HTMX attributes to target updates on parts of the page.
          </p>

              <div className="flex gap-2 mb-6">
                <Rating
                  name="text-feedback"
                  value={4.3}
                  readOnly
                  precision={0.5}
                  size="medium"
                  emptyIcon={
                    <StarIcon className="text-zinc-700" fontSize="inherit" />
                  }
                />
                <p>4.6</p>
                  <Link to="/reviews" className="underline">
                    Leer resenas
                  </Link>
              </div>

          <p className="max-w-2xl text-muted-foreground mb-6">
            4 horas, 20 minutos de duración.
          </p>
        </div>
        <div className="flex gap-2 mt-auto">
          <Link to="/video">
          <Button className="bg-indigo-400 text-black font-semibold hover:bg-indigo-500">
            Ver curso
          </Button>
          </Link>
          <Button className="bg-indigo-400 text-black font-semibold hover:bg-indigo-500">
            Ver preview gratuita
          </Button>
        </div>
      </div>
    </div>
  );
}
