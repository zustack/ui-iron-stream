import {
  deactivateAllCourses,
  deactivateCourseForAllUsers,
  updateActiveStatusAllUser,
} from "@/api/users";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ErrorResponse } from "@/types";
import toast from "react-hot-toast";
import { adminCourses } from "@/api/courses";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Loader, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteAllUserCourses,
  deleteUserCourseByCourseId,
} from "@/api/user-courses";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Course } from "@/types";

export default function Deactivate() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Menu className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Actions
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col" align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DeactivateAllUsers />
        <ActivateAllUsers />
        <DeactivateAllCourses />
        <DeactivateIndividualCourses />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const DeactivateAllUsers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateActiveStatusAllUserMutation = useMutation({
    mutationFn: () => updateActiveStatusAllUser(false),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsOpen(false);
      toast.success("All users deactivated successfully");
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("An error occurred, please try again later");
      }
      toast.error(error.response.data.error);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <DropdownMenuItem
          asChild={false}
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          Deactivate all users
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate all users</AlertDialogTitle>
          <AlertDialogDescription>
            This will deactivate all users, proceed with caution.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={updateActiveStatusAllUserMutation.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant={"destructive"}
            onClick={() => updateActiveStatusAllUserMutation.mutate()}
            disabled={updateActiveStatusAllUserMutation.isPending}
            className="flex gap-2"
          >
            {updateActiveStatusAllUserMutation.isPending && (
              <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
            )}
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ActivateAllUsers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateActiveStatusAllUserMutation = useMutation({
    mutationFn: () => updateActiveStatusAllUser(true),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("All users activated successfully");
      setIsOpen(false);
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("An error occurred, please try again later");
      }
      toast.error(error.response.data.error);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <DropdownMenuItem
          asChild={false}
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          Activate all users
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Activate all users</AlertDialogTitle>
          <AlertDialogDescription>
            This will activate all users, proceed with caution.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={updateActiveStatusAllUserMutation.isPending}
          >
            Cancel
          </AlertDialogCancel>
          {updateActiveStatusAllUserMutation.isPending ? (
            <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
          ) : (
            <Button
              variant={"destructive"}
              disabled={updateActiveStatusAllUserMutation.isPending}
              onClick={() => updateActiveStatusAllUserMutation.mutate()}
            >
              {updateActiveStatusAllUserMutation.isPending && (
                <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
              )}
              Confirm
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const DeactivateAllCourses = () => {
  const [isOpen, setIsOpen] = useState(false);

  const deleteAllUserCoursesMutation = useMutation({
    mutationFn: () => deleteAllUserCourses(),
    onSuccess: () => {
      toast.success("All courses deactivated successfully");
      setIsOpen(false);
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("An error occurred, please try again later");
      }
      toast.error(error.response.data.error);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <DropdownMenuItem
          asChild={false}
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          Deactivate all courses
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate all courses</AlertDialogTitle>
          <AlertDialogDescription>
            This operation will deactivate all courses, proceed with caution
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant={"destructive"}
            onClick={() => deleteAllUserCoursesMutation.mutate()}
            disabled={deleteAllUserCoursesMutation.isPending}
            className="flex gap-2"
          >
            {deleteAllUserCoursesMutation.isPending && (
              <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
            )}
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const DeactivateIndividualCourses = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(0);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["deactivate-individual-courses"],
    queryFn: () => adminCourses("", "1"),
    enabled: isOpen,
  });

  const deleteUserCourseByCourseIdMutation = useMutation({
    mutationFn: () => deleteUserCourseByCourseId(confirmId),
    onSuccess: () => {
      setConfirmId(0);
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("An error occurred, please try again later");
      }
      toast.error(error.response.data.error);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <DropdownMenuItem
          asChild={false}
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          Deactivate individual courses
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate individual courses</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="pb-2">
              This operation will deactivate the selected course to all the
              users, proceed with caution.
            </p>

            <ScrollArea className="h-[300px]">
              <Table className="p-1">
                <TableCaption>
                  {data && data.length === 0 && (
                    <div className="text-center text-zinc-400">
                      No results found.
                    </div>
                  )}

                  {isLoading && (
                    <div className="h-[100px] flex justify-center items-center">
                      <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                    </div>
                  )}

                  {isError && (
                    <div className="h-[100px] flex justify-center items-center">
                      Error: {error.message}
                    </div>
                  )}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course title</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data &&
                    data.map((course: Course) => (
                      <TableRow>
                        <TableCell>{course.title}</TableCell>
                        <TableCell className="text-right">
                          {confirmId === course.id ? (
                            <>
                              <div className="">
                                <Button
                                  onClick={() => setConfirmId(0)}
                                  disabled={
                                    deleteUserCourseByCourseIdMutation.isPending
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1 w-[100px] mr-2"
                                >
                                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Cancel
                                  </span>
                                </Button>
                                <Button
                                  disabled={
                                    deleteUserCourseByCourseIdMutation.isPending
                                  }
                                  onClick={() => {
                                    deleteUserCourseByCourseIdMutation.mutate();
                                  }}
                                  variant="destructive"
                                  size="sm"
                                  className="h-8 gap-1 w-[100px]"
                                >
                                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Confirm
                                  </span>
                                  {deleteUserCourseByCourseIdMutation.isPending && (
                                    <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                                  )}
                                </Button>
                              </div>
                            </>
                          ) : (
                            <Button
                              onClick={() => setConfirmId(course.id)}
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                            >
                              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Deactivate
                              </span>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
