import { authAxios } from "@/lib/axiosInstances";

export const deleteUserAppsByAppIdAndUserId= async (userId: number, appId: number) => {
  const response = await authAxios.delete(`/user/apps/delete/user/apps/${userId}/${appId}`);
  return response.data;
};

export const getUserApps = async (userId: number) => {
  const response = await authAxios.get(`/user/apps/user/apps/${userId}?q=`);
  return response.data;
};

export const createUserApp = async (userId: number, appId: number) => {
  const response = await authAxios.post(`/user/apps/create/${userId}/${appId}`);
  return response.data;
};
