import { authAxios } from "@/lib/axiosInstances";

export const getUserStats = async () => {
  const response = await authAxios.get("/users/stats");
  return response.data;
};
