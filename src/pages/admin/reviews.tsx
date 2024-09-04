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
import { ListFilter, Loader, Search } from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { adminReviews, updatePublicStatus } from "@/api/reviews";

import StarIcon from "@mui/icons-material/Star";
import { Rating } from "@mui/material";
import DeleteReview from "@/components/admin/delete-review";

export default function AdminReviews() {
  const [activeUpdateStatusId, setActiveUpdateStatusId] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [active, setActive] = useState<string>("");

  const queryClient = useQueryClient();

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["admin-reviews", debouncedSearchTerm, active],
    queryFn: () => adminReviews(debouncedSearchTerm, active),
  });

  const updateReviewStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      updatePublicStatus(active, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
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
                placeholder="Search reviews"
                className="pl-8 w-[450px]"
              />
            </div>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            <span>
              {data?.length}{" "}
              {data?.length === 1 ? " review found." : " reviews found."}
            </span>
          </p>

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
                asChild={false}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  if (active === "true") {
                    setActive("");
                    return;
                  }
                  setActive("true");
                }}
                checked={active === "true"}
              >
                Public
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                asChild={false}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  if (active === "false") {
                    setActive("");
                    return;
                  }
                  setActive("false");
                }}
                checked={active === "false"}
              >
                Private
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateCourse />
        </div>
      </div>
      <ScrollArea className="h-full max-h-[calc(100vh-10px-60px)] w-full p-[10px]">
        <Table>
          <TableCaption>
            {isFetching && (
              <div className="h-[100px] flex justify-center items-center">
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              </div>
            )}

            {isError && (
              <div className="h-[100px] flex justify-center items-center">
                <span>An unexpected error occurred: {error.message}</span>
              </div>
            )}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Public</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((r: any) => (
              <TableRow>
                <TableCell>
                  {r.id === activeUpdateStatusId &&
                  updateReviewStatusMutation.isPending ? (
                    <Loader className="h-5 w-5 text-zinc-300 animate-spin slower" />
                  ) : (
                    <Checkbox
                      onClick={() => {
                        setActiveUpdateStatusId(r.id);
                        updateReviewStatusMutation.mutate({
                          id: r.id,
                          active: !r.public,
                        });
                      }}
                      checked={r.public}
                    />
                  )}
                </TableCell>
                <TableCell>{r.course_title}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {r.description.length > 20 ? (
                          <>{r.description.slice(0, 20)} ...</>
                        ) : (
                          <>{r.description}</>
                        )}
                      </TooltipTrigger>
                      <TooltipContent className="w-[400px]">
                        <p>{r.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{r.author}</TableCell>

                <TableCell className="flex gap-2 items-center">
                  <Rating
                    name="text-feedback"
                    value={4}
                    readOnly
                    precision={0.5}
                    size="medium"
                    icon={
                      <StarIcon className="text-yellow-500" fontSize="medium" />
                    }
                    emptyIcon={
                      <StarIcon className="text-zinc-500" fontSize="medium" />
                    }
                  />
                </TableCell>
                <TableCell>{r.created_at}</TableCell>

                <TableCell className="text-right">
                  <DeleteReview
                    id={r.id}
                    description={r.description}
                    author={r.author}
                    rating={r.rating}
                    course_title={r.course_title}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
