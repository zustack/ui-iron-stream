import { authAxios } from "@/lib/axiosInstances";

export const deleteNotifications = async (payload: { info: string }[]) => {
  console.log(payload)
  const response = await authAxios.post("/notifications", {
    payload,
  });
  return response.data;
};

export const getNotifications = async () => {
  const response = await authAxios.get("/notifications");
  return response.data;
};
