import { getCurrentUser } from "@/api/users";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Home } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import LoadImage from "@/components/load-image";

export default function Account() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["fobidden-apps"],
    queryFn: () => getCurrentUser(),
  });

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-11">
        <h1 className="text-2xl md:text-3xl font-semibold">Account Settings</h1>
      </div>
      <Separator className="mb-12" />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 w-full">
          <nav className="grid items-start text-sm font-medium">
            <button
              onClick={() => setPage(0)}
              className="flex items-center gap-3 py-2 text-muted-foreground rounded-lg transition-all hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Account settings
            </button>
            <button
              onClick={() => setPage(1)}
              className="flex items-center gap-3 py-2 text-muted-foreground rounded-lg transition-all hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Video history
            </button>
          </nav>
        </div>

        <div className="md:w-3/4 w-full">
          {page === 0 && (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <p>Email: {data?.email}</p>
                    <p>Name: {data?.name}</p>
                    <p>Surname: {data?.surname}</p>
                    <p>Created at: {data?.created_at}</p>

                    <form className="flex flex-col gap-2">
                      <p>Update your current password</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <PasswordInput
                          placeholder="New password"
                          className="w-full"
                        />
                        <PasswordInput
                          placeholder="Confirm new password"
                          className="w-full"
                        />
                      </div>
                    </form>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex justify-end">
                  <Button>Update password</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {page === 1 && (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video history</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-6">
                    <div className="col-span-2">
                      <LoadImage
                        cn="rounded-[0.75rem]"
                        src={
                          "http://localhost:8081/web/uploads/thumbnails/1492331a-060b-4a3c-8cc8-55d72ff18450.png"
                        }
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="flex flex-col gap-[15px] mx-2 py-1">
                        <h4 className="font-semibold">
                          CloudFront Signed URLs with Node.js
                        </h4>
                        <p className="text-sm text-zinc-200">
                          Create signed urls to access files in a CloudFront
                          distribution. Learn how to generate the signed URLs
                          using a private key in a node application.
                        </p>
                        <div className="flex gap-2">
                          <p className="text-sm text-zinc-400">4 hours</p>
                          <p className="text-sm text-zinc-400">•</p>
                          <p className="text-sm text-zinc-400">69 views</p>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="grid grid-cols-6">
                    <div className="col-span-2">
                      <LoadImage
                        cn="rounded-[0.75rem]"
                        src={
                          "http://localhost:8081/web/uploads/thumbnails/1492331a-060b-4a3c-8cc8-55d72ff18450.png"
                        }
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="flex flex-col gap-[15px] mx-2 py-1">
                        <h4 className="font-semibold">
                          CloudFront Signed URLs with Node.js
                        </h4>
                        <p className="text-sm text-zinc-200">
                          Create signed urls to access files in a CloudFront
                          distribution. Learn how to generate the signed URLs
                          using a private key in a node application.
                        </p>
                        <div className="flex gap-2">
                          <p className="text-sm text-zinc-400">4 hours</p>
                          <p className="text-sm text-zinc-400">•</p>
                          <p className="text-sm text-zinc-400">69 views</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
