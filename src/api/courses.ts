import { authAxios } from "@/lib/axiosInstances";

export const CHUNK_SIZE = 1 * 1024 * 1024;

export const userCourses = async (query: string, userId: number) => {
  const response = await authAxios.get(`/user/courses/${userId}?q=${query}`);
  return response.data;
};

export const adminCourses = async (searchParam: string, active: string) => {
  const response = await authAxios.get(
    `/courses/admin?q=${searchParam}&a=${active}`
  );
  return response.data;
};

export const updateCourseActiveStatus = async (
  course_id: number,
  active: boolean
) => {
  const response = await authAxios.put(
    `/courses/update/active/${course_id}/${active}`
  );
  return response.data;
};

export const sortCourses = async (
  sort_courses: { id: number; sort_order: string }[]
) => {
  const response = await authAxios.post("/courses/sort", {
    sort_courses: sort_courses,
  });
  return response.data;
};

export const getSoloCourse = async (id: number) => {
  const response = await authAxios.get(`/courses/solo/${id}`);
  return response.data;
};

export const deleteCourse = async (id: number) => {
  const response = await authAxios.delete(`/courses/delete/${id}`);
  return response.data;
};

export const updateCourse = async ({
  id,
  title,
  description,
  author,
  duration,
  is_active,
  price,
  thumbnail,
  old_thumbnail,
  preview_tmp,
  old_preview,
}: {
  id: number;
  title: string;
  description: string;
  author: string;
  duration: string;
  is_active: boolean;
  price: string;
  thumbnail: File | undefined;
  old_thumbnail: string;
  preview_tmp: string;
  old_preview: string;
}) => {
  const formData = new FormData();
  formData.append("id", id.toString());
  formData.append("title", title);
  formData.append("description", description);
  formData.append("author", author);
  formData.append("duration", duration);
  formData.append("is_active", is_active.toString());
  formData.append("price", price);
  formData.append("thumbnail", thumbnail || "");
  formData.append("old_thumbnail", old_thumbnail);
  formData.append("preview_tmp", preview_tmp);
  formData.append("old_preview", old_preview);
  const response = await authAxios.put("/courses/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const createCourse = async ({
  title,
  description,
  author,
  duration,
  is_active,
  price,
  thumbnail,
  preview_tmp,
}: {
  title: string;
  description: string;
  author: string;
  duration: string;
  is_active: boolean;
  price: string;
  thumbnail: File;
  preview_tmp: string;
}) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("author", author);
  formData.append("duration", duration);
  formData.append("is_active", is_active.toString());
  formData.append("price", price);
  formData.append("thumbnail", thumbnail);
  formData.append("preview_tmp", preview_tmp);

  const response = await authAxios.post("/courses/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const uploadChunk = async ({
  file,
  chunkNumber,
  totalChunks,
  uuid,
}: {
  file: File;
  chunkNumber: number;
  totalChunks: number;
  uuid: string;
}) => {
  const start = chunkNumber * CHUNK_SIZE;
  const end = Math.min(start + CHUNK_SIZE, file.size);
  const chunk = file.slice(start, end);

  const formData = new FormData();
  formData.append("file", chunk, file.name);
  formData.append("chunkNumber", chunkNumber.toString());
  formData.append("totalChunks", totalChunks.toString());
  formData.append("uuid", uuid);

  const response = await authAxios.post("/courses/chunk/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
