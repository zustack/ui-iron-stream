import { authAxios } from "@/lib/axiosInstances";

export const getNotifications = async () => {
  const response = await authAxios.get("/notifications");
  return response.data;
};
