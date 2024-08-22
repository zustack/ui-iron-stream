import { authAxios } from "@/lib/axiosInstances";

export const updateAppStatus = async (id: number, is_active: boolean) => {
  const response = await authAxios.put(
    `/apps/update/status/${id}/${is_active}`
  );
  return response.data;
};

export const getActiveApps = async () => {
  const response = await authAxios.get("/apps/active");
  return response.data;
};

export const getAppById = async (id: number) => {
  const response = await authAxios.get(`/apps/by/id/${id}`);
  return response.data;
};

export const getAdminApps = async (searchParam: string, is_active: string) => {
  const response = await authAxios.get(
    `/apps/admin?q=${searchParam}&a=${is_active}`
  );
  return response.data;
};

export const updateApp = async (
  id: number,
  name: string,
  process_name: string,
  is_active: boolean
) => {
  const response = await authAxios.put("/apps/update", {
    id,
    name,
    process_name,
    is_active,
  });
  return response.data;
};

export const deleteApp = async (id: number) => {
  const response = await authAxios.delete(`/apps/delete/${id}`);
  return response.data;
};

export const createApp = async (
  name: string,
  process_name: string,
  is_active: boolean
) => {
  const response = await authAxios.post("/apps/create", {
    name,
    process_name,
    is_active,
  });
  return response.data;
};
