import { authAxios } from "@/lib/axiosInstances";

export const deletePolicy = async (id: number) => {
  const response = await authAxios.delete(`/policy/${id}`);
  return response.data;
};

export const createPolicy = async (content: string, p_type: string) => {
  const response = await authAxios.post(`/policy`, {content, p_type});
  return response.data;
};

export const getPolicy = async () => {
  const response = await authAxios.get(`/policy`);
  return response.data;
};
