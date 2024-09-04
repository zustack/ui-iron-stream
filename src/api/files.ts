import { authAxios } from "@/lib/axiosInstances";

export const uploadFile = async (
  path: File,
  page: number,
  videoID: string,
) => {
  const formData = new FormData();
  formData.append("path", path);
  formData.append("page", page.toString());
  formData.append("videoID", videoID);
  const response = await authAxios.post("/files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getFiles = async (page: number, videoID?: string) => {
  const response = await authAxios.get(`/files/${videoID}/${page}`);
  return response.data;
}

export const deleteFile = async (id:number) => {
  const response = await authAxios.delete(`/files?id=${id}`);
  return response.data;
}

