import { authAxios } from "@/lib/axiosInstances";

export const getUserStats = async (from:string, to:string) => {
  console.log("from", from, "to", to)
  const response = await authAxios.get(`/users/stats/?from=${from}&to=${to}`);
  return response.data;
};
