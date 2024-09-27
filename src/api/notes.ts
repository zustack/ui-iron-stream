import { authAxios } from "@/lib/axiosInstances";

export const updateNote = async (id: number, body: string) => {
  const response = await authAxios.put(`/notes/${id}`, {body});
  return response.data;
};

export const deleteNote = async (id: number) => {
  const response = await authAxios.delete(`/notes/${id}`);
  return response.data;
};

export const createNote = async (courseId: string, body: string, time: number, video_title: string, videoId: number) => {
  const response = await authAxios.post(`/notes/${courseId}/${videoId}`, {
    body,
    time,
    video_title
  });
  return response.data;
};

export const getNotes = async (courseId: string) => {
  const response = await authAxios.get(`/notes/${courseId}`);
  return response.data;
};
