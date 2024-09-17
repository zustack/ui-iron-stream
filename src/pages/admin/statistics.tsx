import CoursesStats from "@/components/admin/stats/courses";
import UsersStats from "@/components/admin/stats/users";

export default function Statistics() {

  return (
    <section className="p-[10px] flex flex-col gap-[10px]">
      <UsersStats />
      <CoursesStats />
    </section>
  );
}
