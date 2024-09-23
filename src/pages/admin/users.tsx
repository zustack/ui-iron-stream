import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Bell, ListFilter, Loader, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useInView } from "react-intersection-observer";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ErrorResponse, User } from "@/types";
import {
  adminUsers,
  updateSpecialAppUser,
  updateActiveStatus,
  updateAdminStatus,
} from "@/api/users";
import AddCouseToUser from "@/components/admin/users/add-course-to-user";
import Deactivate from "@/components/admin/users/deactivate";
import UserApps from "@/components/admin/users/user-apps";
import DeleteUser from "@/components/admin/users/delete-user";
import { deleteNotifications } from "@/api/notifications";
import { DateRange } from "react-day-picker";
import AdminUserLog from "@/components/admin/users/user-log";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AdminUsers() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeId, setActiveId] = useState(0);

  const [activeParam, setActiveParam] = useState<number | string>("");
  const [adminParam, setAdminParam] = useState<number | string>("");
  const [specialParam, setSpecialParam] = useState<number | string>("");
  const [verifiedParam, setVerifiedParam] = useState<number | string>("");
  const [isNotification, setIsNotification] = useState<any[]>([]);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const queryClient = useQueryClient();

  const { ref, inView } = useInView();

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "admin-users",
      debouncedSearchTerm,
      activeParam,
      adminParam,
      specialParam,
      verifiedParam,
      date?.from,
      date?.to,
    ],
    queryFn: async ({ pageParam }) => {
      return adminUsers({
        pageParam: pageParam ?? 0,
        searchParam: debouncedSearchTerm,
        active: activeParam,
        admin: adminParam,
        special: specialParam,
        verified: verifiedParam,
        from: String(
          date?.from == undefined ? "" : format(date.from, "dd/MM/yyyy")
        ),
        to: String(date?.to == undefined ? "" : format(date.to, "dd/MM/yyyy")),
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    initialPageParam: 0,
  });

  const deleteNsMutation = useMutation({
    mutationFn: () => deleteNotifications(isNotification),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      localStorage.removeItem("review_n");
      setIsNotification([]);
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    },
  });

  const userInfo = localStorage.getItem("user_n");
  useEffect(() => {
    if (userInfo) {
      const parsedReviewInfo = JSON.parse(userInfo);
      setIsNotification(parsedReviewInfo);
    }
  }, [userInfo]);

  const updateActiveMutation = useMutation({
    mutationFn: (user_id: number) => updateActiveStatus(user_id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error ||
          "An error occurred, please try again later"
      );
    },
  });

  const updateAdminStatusMutation = useMutation({
    mutationFn: ({ userId, isAdmin }: { userId: number; isAdmin: boolean }) =>
      updateAdminStatus(userId, isAdmin),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error ||
          "An error occurred, please try again later"
      );
    },
  });

  const updateSpecialAppUserMutation = useMutation({
    mutationFn: ({
      userId,
      specialApp,
    }: {
      userId: number;
      specialApp: boolean;
    }) => updateSpecialAppUser(userId, specialApp),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(
        error.response?.data?.error ||
          "An error occurred, please try again later"
      );
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      const backendSearchInput = searchInput.replace(/ /g, "&");
      setDebouncedSearchTerm(backendSearchInput);
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
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={handleInputChange}
                type="search"
                placeholder="Search for users"
                className="pl-8 w-[450px]"
              />
            </div>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {data?.pages[0].data === null ? (
              <span>No users found.</span>
            ) : (
              <span>
                {data?.pages[0].totalCount}{" "}
                {data?.pages[0].totalCount === 1
                  ? " user found."
                  : " users found."}
              </span>
            )}
          </p>

          <div className={cn("grid gap-2")}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left h-8",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd/MM/yyyy")} -{" "}
                        {format(date.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(date.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {isNotification != null && (
            <Button
              disabled={
                isNotification?.length === 0 || deleteNsMutation.isPending
              }
              onClick={() => {
                deleteNsMutation.mutate();
              }}
              variant="outline"
              size="sm"
              className="h-8 gap-1"
            >
              <Bell className="h-3.5 w-3.5" />
              {deleteNsMutation.isPending && (
                <Loader className="h-4 w-4 animate-spin" />
              )}
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Mark notifications as read
              </span>
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
                asChild={false}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  if (activeParam === 1) {
                    setActiveParam("");
                  } else {
                    setActiveParam(1);
                  }
                }}
                checked={activeParam === 1}
              >
                Active
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                asChild={false}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  if (activeParam === 0) {
                    setActiveParam("");
                  } else {
                    setActiveParam(0);
                  }
                }}
                checked={activeParam === 0}
              >
                Inactive
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              <DropdownMenuCheckboxItem
                asChild={false}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  if (adminParam === 1) {
                    setAdminParam("");
                  } else {
                    setAdminParam(1);
                  }
                }}
                checked={adminParam === 1}
              >
                Admin
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                asChild={false}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  if (adminParam === 0) {
                    setAdminParam("");
                  } else {
                    setAdminParam(0);
                  }
                }}
                checked={adminParam === 0}
              >
                Non admin
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              <DropdownMenuCheckboxItem
                asChild={false}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  if (verifiedParam === 1) {
                    setVerifiedParam("");
                  } else {
                    setVerifiedParam(1);
                  }
                }}
                checked={verifiedParam === 1}
              >
                Verified
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                asChild={false}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  if (verifiedParam === 0) {
                    setVerifiedParam("");
                  } else {
                    setVerifiedParam(0);
                  }
                }}
                checked={verifiedParam === 0}
              >
                Non verified
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              <DropdownMenuCheckboxItem
                asChild={false}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  if (specialParam === 1) {
                    setSpecialParam("");
                  } else {
                    setSpecialParam(1);
                  }
                }}
                checked={specialParam === 1}
              >
                Active apps
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                asChild={false}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  if (specialParam === 0) {
                    setSpecialParam("");
                  } else {
                    setSpecialParam(0);
                  }
                }}
                checked={specialParam === 0}
              >
                Non active apps
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Deactivate />
        </div>
      </div>
      <ScrollArea className="h-full max-h-[calc(100vh-10px-60px)] w-full p-[10px]">
        <Table>
          <TableCaption>
            {status === "pending" && (
              <div className="h-[100px] flex justify-center items-center">
                <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
              </div>
            )}

            {status === "error" && (
              <div className="h-[100px] flex justify-center items-center">
                <span>An unexpected error occurred: {error.message}</span>
              </div>
            )}

            <div ref={ref} onClick={() => fetchNextPage()}>
              {isFetchingNextPage && (
                <div className="h-[100px] flex justify-center items-center">
                  <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                </div>
              )}
            </div>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Active</TableHead>
              <TableHead className="w-[100px]">Admin</TableHead>
              <TableHead className="w-[100px]">Verified</TableHead>
              <TableHead className="w-[100px]">Apps</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Surname</TableHead>
              <TableHead>Machine UUID</TableHead>
              <TableHead>Operating System</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.pages?.map((page) => (
              <React.Fragment key={page.nextId}>
                {page?.data?.map((user: User) => (
                  <>
                    <TableRow
                      className={
                        isNotification?.some((info) => info.info == user.email)
                          ? "bg-muted/80 border"
                          : ""
                      }
                    >
                      <TableCell>
                        {activeId === user.id &&
                        updateActiveMutation.isPending ? (
                          <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
                        ) : (
                          <Checkbox
                            onClick={() => {
                              updateActiveMutation.mutate(user.id);
                              setActiveId(user.id);
                            }}
                            disabled={user.id === 1}
                            checked={user.is_active}
                          />
                        )}
                      </TableCell>

                      <TableCell>
                        {activeId === user.id &&
                        updateAdminStatusMutation.isPending ? (
                          <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
                        ) : (
                          <Checkbox
                            onClick={() => {
                              setActiveId(user.id);
                              updateAdminStatusMutation.mutate({
                                userId: user.id,
                                isAdmin: !user.is_admin,
                              });
                            }}
                            disabled={user.id === 1}
                            checked={user.is_admin}
                          />
                        )}
                      </TableCell>

                      <TableCell>
                        <Checkbox
                          className="cursor-not-allowed"
                          checked={user.verified}
                        />
                      </TableCell>

                      <TableCell className="flex items-center gap-1">
                        {activeId === user.id &&
                        updateSpecialAppUserMutation.isPending ? (
                          <Loader className="h-5 w-5 text-zinc-200 animate-spin slower" />
                        ) : (
                          <Checkbox
                            onClick={() => {
                              updateSpecialAppUserMutation.mutate({
                                userId: user.id,
                                specialApp: !user.special_apps,
                              });
                              setActiveId(user.id);
                            }}
                            checked={user.special_apps}
                          />
                        )}
                        <UserApps
                          email={user.email}
                          name={user.name}
                          surname={user.surname}
                          userId={user.id}
                        />
                      </TableCell>

                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.surname}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              {user.pc.slice(0, 8)}...
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{user.pc}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>{user.os}</TableCell>
                      <TableCell>{user.created_at}</TableCell>

                      <TableCell className="text-right">
                        <AdminUserLog
                          email={user.email}
                          name={user.name}
                          surname={user.surname}
                          userId={user.id}
                        />
                        <AddCouseToUser
                          email={user.email}
                          name={user.name}
                          surname={user.surname}
                          userId={user.id}
                        />
                        <DeleteUser
                          email={user.email}
                          name={user.name}
                          surname={user.surname}
                        />
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
