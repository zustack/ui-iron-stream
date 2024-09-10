import { authAxios } from "@/lib/axiosInstances";

export const getUserHistory = async () => {
  const response = await authAxios.get("/history");
  return response.data;
};
