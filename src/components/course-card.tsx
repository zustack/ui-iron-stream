import { Link, useNavigate } from "react-router-dom";
import Image from "../assets/image.png";
import { Button } from "./ui/button";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  MessageSquareMore,
  Video,
} from "lucide-react";
import toast from "react-hot-toast";
import { useVideoResumeStore } from "@/store/video-resume";

type CourseProp = {
  id: number;
  title: string;
  description: string;
  author: string;
  thumbnail: string;
  rating: number;
  duration: string;
  allowed: boolean;
  preview: string;
};

export default function CourseCard({ course }: { course: CourseProp }) {
  const navigate = useNavigate();
  const { changePage } = useVideoResumeStore()

  return (
    <div className="bg-zinc-900 rounded-[0.75rem] grid grid-cols-2 min-h-[300px] border mb-8">
      <img
        src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
        alt=""
        className="p-1 rounded-[0.75rem]"
      />
      <div className="flex flex-col justify-between p-4">
        <div>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight leading-none text-zinc-200 mb-6">
            {course.title}
          </h1>

          <p className="max-w-2xl text-zinc-200 mb-4">{course.author}</p>

          <p className="max-w-2xl text-zinc-200 mb-4">{course.description}</p>

          <div className="flex gap-2 mb-6">
            <Rating
              name="text-feedback"
              value={course.rating}
              readOnly
              precision={0.5}
              size="medium"
              emptyIcon={
                <StarIcon className="text-zinc-700" fontSize="inherit" />
              }
            />
            <p>{course.rating}</p>
            <Link to="/reviews" className="underline">
              Leer resenas
            </Link>
          </div>

          <p className="max-w-2xl text-muted-foreground mb-6">
            {course.duration}
          </p>
        </div>
        <div className="flex gap-2 mt-auto flex-col lg:flex-row">
          {course.allowed ? (
            <>
              <Button
                onClick={() => {
                  changePage(false)
                  navigate(`/video/${course.id}`)}}
                className="bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
              >
                Ingresar
                <ChevronRight className="h-5 w-5" />
              </Button>

              <Button
                onClick={() => navigate(`/reviews/create/${course.id}`)}
                className="bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
              >
                Crear resena
                <MessageSquareMore className="h-5 w-5 ml-2" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => toast.error("No tienes acceso a este curso")}
              className="bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
            >
              No tienes acceso a este curso
              <Lock className="h-5 w-5 ml-2" />
            </Button>
          )}

          {course.preview && (
            <Button
              onClick={() => navigate(`/course/preview/${course.id}`)}
              className="bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
            >
              Ver preview gratuita
              <Video className="h-5 w-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
