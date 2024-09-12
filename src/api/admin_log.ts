import { authAxios } from "@/lib/axiosInstances";

export const createAdminLog = async (content: string, l_type: string) => {
  const response = await authAxios.post("/log/admin", {
    content,
    l_type
  });
  return response.data;
};

export const getAdminLog = async () => {
  const response = await authAxios.get("/log/admin");
  return response.data;
};
