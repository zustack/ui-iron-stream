import { authAxios } from "@/lib/axiosInstances";

export const getForbiddenApps = async () => {
  const response = await authAxios.get(`/special/apps/get`);
  return response.data;
};

export const getUserSpecialApps = async (userId: number) => {
  const response = await authAxios.get(`/special/apps/get/${userId}`);
  return response.data;
};

export const createSpecialApps = async (apps: { name: string; process_name: string; os: string; is_active: boolean }[], userId: number) => {
  const response = await authAxios.post("/special/apps/create", {
    apps: apps,
    user_id: userId
  })
  return response.data
}

export const deleteApp = async (id:number) => {
  const response = await authAxios.delete(`/apps/delete/${id}`)
  return response.data
}

export const updateApp = async (id:number, name: string, process_name: string, os: string, is_active: boolean) => {
  const response = await authAxios.put("/apps/update", {
    id,
    name,
    process_name,
    os,
    is_active
  })
  return response.data
}

export const createApp = async (name: string, process_name: string, os: string, is_active: boolean) => {
  const response = await authAxios.post("/apps/create", {
    name,
    process_name,
    os,
    is_active
  })
  return response.data
}

export const getApps = async (searchParam: string, is_active: string) => {
  const response = await authAxios.get(`/apps?q=${searchParam}&a=${is_active}`);
  return response.data;
};