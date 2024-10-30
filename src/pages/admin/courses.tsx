import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListFilter, Search, VideoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState, ChangeEvent } from "react";
import CreateCourse from "@/components/admin/courses/create-course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminCourses,
  sortCourses,
  updateCourseActiveStatus,
} from "@/api/courses";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import UpdateCourse from "@/components/admin/courses/update-course";
import { Link } from "react-router-dom";
import { Course } from "@/types";
import DeleteCourse from "@/components/admin/courses/delete-course";
import ImageDialog from "@/components/admin/image-dialog";
import VideoDialog from "@/components/admin/video-dialog";
import Spinner from "@/components/ui/spinner";

export default function AdminCourses() {
  const [activeUpdateStatusId, setActiveUpdateStatusId] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [active, setActive] = useState<string>("");

  const queryClient = useQueryClient();

  const [isEditSort, setIsEditSort] = useState(false);
  const [editSort, setEditSort] = useState<
    { id: number; sort_order: string }[]
  >([]);

  const sortCoursesMutation = useMutation({
    mutationFn: () => sortCourses(editSort),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      setIsEditSort(false);
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const handleInputSortChange = (id: number, value: string) => {
    setEditSort((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index !== -1) {
        const updatedSorts = [...prev];
        updatedSorts[index] = { id, sort_order: value };
        return updatedSorts;
      } else {
        return [...prev, { id, sort_order: value }];
      }
    });
  };

  const { data, isFetching, isError } = useQuery({
    queryKey: ["admin-courses", debouncedSearchTerm, active],
    queryFn: () => adminCourses(debouncedSearchTerm, active),
  });

  const updateCourseStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      updateCourseActiveStatus(id, active),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, 800);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchInput]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchInput(value);
  };

  return (
    <>
      <div className="bg-muted/40 flex justify-between items-center px-[10px] h-[60px] border border-b">
        <div>
          <form className="ml-auto flex-1 sm:flex-initial mr-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={handleInputChange}
                type="search"
                placeholder="Search"
                className="pl-8 w-[450px]"
              />
            </div>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {data != null && !isFetching && (
              <span>
                {data?.length}{" "}
                {data?.length === 1 ? " course found." : " courses found."}
              </span>
            )}
          </p>

          {data != null && !isFetching && (
            <>
              {isEditSort ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (
                        editSort.map((item) => item.sort_order).join("") === ""
                      ) {
                        toast.error("You must enter at least one sort order.");
                        return;
                      }
                      sortCoursesMutation.mutate();
                    }}
                    size="sm"
                    className="h-8 gap-1"
                  >
                    Save changes
                  </Button>
                  <Button
                    onClick={() => setIsEditSort(false)}
                    variant="destructive"
                    size="sm"
                    className="h-8 gap-1"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditSort(true)}
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1"
                >
                  Sort courses
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    onClick={() => setActive("1")}
                    checked={active === "1"}
                  >
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    onClick={() => setActive("0")}
                    checked={active === "0"}
                  >
                    Non active
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <CreateCourse />
        </div>
      </div>
      <ScrollArea className="h-full max-h-[calc(100vh-10px-60px)] w-full p-[10px]">
        <Table>
          <TableCaption>
            {data == null && !isFetching && (
              <div className="h-[100px] flex justify-center items-center">
                No courses found.
              </div>
            )}

            {isFetching && (
              <div className="h-[100px] flex justify-center items-center">
                <Spinner />
              </div>
            )}

            {isError && (
              <div className="h-[100px] flex justify-center items-center">
                <span>An unexpected error occurred.</span>
              </div>
            )}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead className="w-[50px]">Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((course: Course) => (
              <TableRow>
                <TableCell>
                  {course.id === activeUpdateStatusId &&
                  updateCourseStatusMutation.isPending ? (
                    <Spinner />
                  ) : (
                    <Checkbox
                      onClick={() => {
                        setActiveUpdateStatusId(course.id);
                        updateCourseStatusMutation.mutate({
                          id: course.id,
                          active: !course.is_active,
                        });
                      }}
                      checked={course.is_active}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {isEditSort ? (
                    <Input
                      className="h-8 w-20"
                      type="text"
                      defaultValue={course.sort_order}
                      value={
                        editSort.find((item) => item.id === course.id)
                          ?.sort_order ?? course.sort_order
                      }
                      onChange={(e) =>
                        handleInputSortChange(course.id, e.target.value)
                      }
                    />
                  ) : (
                    <>{course.sort_order}</>
                  )}
                </TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {course.description.length > 20 ? (
                          <>{course.description.slice(0, 20)} ...</>
                        ) : (
                          <>{course.description}</>
                        )}
                      </TooltipTrigger>
                      <TooltipContent className="w-full">
                        <p>{course.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {course.author.length > 10 ? (
                          <>{course.author.slice(10, -1)} ...</>
                        ) : (
                          <>{course.author}</>
                        )}
                      </TooltipTrigger>
                      <TooltipContent className="w-full text-center">
                        <p>{course.author}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {course.duration.length > 10 ? (
                          <>{course.duration.slice(0, 10)} ...</>
                        ) : (
                          <>{course.duration}</>
                        )}
                      </TooltipTrigger>
                      <TooltipContent className="w-full text-center">
                        <p>{course.duration}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>

                <TableCell>$ {course.price}</TableCell>
                <TableCell>
                  <ImageDialog
                    title={course.title}
                    src={`${import.meta.env.VITE_BACKEND_URL}${course.thumbnail}`}
                  />
                </TableCell>

                <TableCell>
                  {course.preview && (
                    <VideoDialog
                      title={course.title}
                      src={`${import.meta.env.VITE_BACKEND_URL}${course.preview}`}
                    />
                  )}
                </TableCell>

                <TableCell>{course.num_reviews}</TableCell>
                <TableCell>{course.rating}</TableCell>
                <TableCell>{course.created_at}</TableCell>

                <TableCell className="text-right">
                  <Link to={`/admin/videos/${course.id}/${course.title}`}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 gap-1 mx-1"
                    >
                      <VideoIcon className="h-5 w-5 text-zinc-200" />
                    </Button>
                  </Link>
                  <UpdateCourse course={course} />
                  <DeleteCourse id={course.id} title={course.title} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
