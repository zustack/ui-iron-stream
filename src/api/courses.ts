import { authAxios } from "@/lib/axiosInstances";

export const CHUNK_SIZE = 1 * 1024 * 1024;

export const updateCourse = async ({
  id,
  title,
  description,
  author,
  duration,
  is_active,
  thumbnail,
  preview_tmp,
}: {
  id: number;
  title: string;
  description: string;
  author: string;
  duration: string;
  is_active: boolean;
  thumbnail: File;
  preview_tmp: string;
}) => {
  const formData = new FormData();
  formData.append("id", id.toString());
  formData.append("title", title);
  formData.append("description", description);
  formData.append("author", author);
  formData.append("duration", duration);
  formData.append("is_active", is_active.toString());
  formData.append("thumbnail", thumbnail);
  formData.append("preview_tmp", preview_tmp);

  const response = await authAxios.put("/courses/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
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

type Course = {
  id: number;
  title: string;
  description: string;
  author: string;
  thumbnail: string;
  rating: number;
  num_reviews: number;
  duration: string;
  is_active: boolean;
  order_: number;
  on: boolean;
  created_at: string;
};

type CourseResponse = {
  data: Course[];
  totalCount: number;
  previousId: number | null;
  nextId: number | null;
}

type SearchParam = {
  searchParam: string;
  pageParam: number;
  active: number | string;
}
/*
curl -X GET "http://localhost:8081/courses/admin?cursor=0&q=&a="  \
*/
export const adminCourses = async ({
  pageParam = 0,
  searchParam,
  active,
}: SearchParam): Promise<CourseResponse> => {
  console.log("active", active)
  const response = await authAxios.get<CourseResponse>(
    `/courses/admin?cursor=${pageParam}&q=${searchParam}&a=${active}`
  );
  return response.data;
};

export const createCourse = async ({
  title,
  description,
  author,
  duration,
  is_active,
  thumbnail,
  preview_tmp,
}: {
  title: string;
  description: string;
  author: string;
  duration: string;
  is_active: boolean;
  thumbnail: File;
  preview_tmp: string;
}) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("author", author);
  formData.append("duration", duration);
  formData.append("is_active", is_active.toString());
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
