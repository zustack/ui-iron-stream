import { authAxios } from "@/lib/axiosInstances";

export const foundAppsLog = async (videoTitle: string, apps: { name: string }[]) => {
  const response = await authAxios.post("/log/user/found/apps", {
    video_title: videoTitle,
    apps,
  });
  return response.data;
};

export const logout = async () => {
  const response = await authAxios.post("/log/user/logout");
  return response.data;
};

export const getUserLog = async (userId: number) => {
  const response = await authAxios.get(`/log/user/${userId}`);
  return response.data;
};
