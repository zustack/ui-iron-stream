import { adminCourses, coursesByUserId, userCourses } from "@/api/courses";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addCourseToUser } from "@/api/users";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { createSpecialApps, getApps, getUserSpecialApps } from "@/api/apps";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";

type Props = {
  userId: number;
  email: string;
  name: string;
  surname: string;
  special_app: boolean;
};

export default function TrueSpecialApps({
  userId,
  email,
  name,
  surname,
  special_app,
}: Props) {
  const [apps, setApps] = useState<
    { process_name: string; name: string; os: string; is_active: boolean }[]
  >([]);

  const { data, status, error, isSuccess } = useQuery({
    queryKey: ["true-admin-apps-user", userId],
    queryFn: () => getUserSpecialApps(userId),
  });

  /*
	Apps   []database.App `json:"apps"`
	UserId int64          `json:"user_id"`
  user_id, name, process_name, os, is_active, created_at
  */

  console.log("las apps payload", apps);
  console.log("las data", data);

  const createSpecialAppsMutation = useMutation({
    mutationFn: () => createSpecialApps(apps, userId),
    onSuccess: () => {
      toast.success("Apps agregadas al usuario");
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  /*
  if (data && data.data) {
  console.log(apps)
  }
  */
  /*
  function setAllApps() {
      const formattedApps = data.map((app) => ({
        process_name: app.process_name,
        name: app.name,
        os: app.os,
        is_active: app.is_active,
      }));
      setApps(formattedApps);
  }
  */

  useEffect(() => {
    if (status === "success" && data) {
      const formattedApps = data.map((app) => ({
        process_name: app.process_name,
        name: app.name,
        os: app.os,
        is_active: app.is_active,
      }));
      setApps(formattedApps);
      console.log("formatted", formattedApps);
    }
  }, [data, status, userId]);

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="outline" size="icon" className="h-8 gap-1 mx-1">
          <Plus className="h-5 w-5 text-zinc-200" />T
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Agregar aplicaciones especiales al usuario {email} {userId}
            <button
            // onClick={() => setAllApps()}
            >Set apps</button>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <ScrollArea className="h-[200px] w-[350px]p-4">
              {data == null && (
                <div className="h-[100px] flex justify-center items-center">
                  No apps found
                </div>
              )}
              {status === "pending" ? (
                <div className="h-[100px] flex justify-center items-center">
                  <Loader className="h-6 w-6 text-zinc-200 animate-spin slower" />
                </div>
              ) : null}

              {status === "error" ? <span>Error: {error.message}</span> : null}

              {data == undefined ? (
                <div>No data bro</div>
              ) : (
                <>
                  {data &&
                    data.map((app: any) => (
                      <div className="flex items-center space-x-2 py-2">
                        {app.is ? "✅" : "❌"}
                        <Checkbox
                          checked={
                            apps.find((item) => item.name === app.name)
                              ? true
                              : false 
                          }
                          onClick={() => {
                            if (apps.find((item) => item.name === app.name)) {
                              setApps(
                                apps.filter((item) => item.name !== app.name)
                              );
                              return;
                            }
                            setApps([
                              ...apps,
                              {
                                name: app.name,
                                process_name: app.process_name,
                                os: app.os,
                                is_active: app.is_active,
                              },
                            ]);
                          }}
                          id="terms"
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {app.name}
                          {app.os}
                        </label>
                      </div>
                    ))}
                </>
              )}
            </ScrollArea>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          <AlertDialogAction>
            <Button
              onClick={() => {
                createSpecialAppsMutation.mutate();
              }}
            >
              Agregar
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
