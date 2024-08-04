import CourseCard from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  return (
      <section className="">
      <form className="ml-auto flex-1 sm:flex-initial mb-8 mr-4 flex justify-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Busca un curso ..."
            className="pl-8 w-[800px]"
          />
        </div>
      </form>
        <CourseCard />
      </section>
  );
}
