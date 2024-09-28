import CoursesStats from "@/components/admin/stats/courses";
import UsersStats from "@/components/admin/stats/users";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Statistics() {
  return (
    <ScrollArea
      className="flex flex-col gap-[10px] h-full
    max-h-[calc(100vh)] w-full p-[10px]"
    >
      <div className="flex flex-col gap-[10px]">
      <UsersStats />
      <CoursesStats />
      </div>
    </ScrollArea>
  );
}
