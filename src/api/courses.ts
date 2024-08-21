import { authAxios } from "@/lib/axiosInstances";

export const CHUNK_SIZE = 1 * 1024 * 1024;

export const sortCourses = async (sort_courses: { id: number; sort_order: string }[]) => {
  const response = await authAxios.post("/courses/sort/trash", {
    sort_courses: sort_courses
  })
  return response.data
}

export const updateCourse = async ({
  id,
  sort_order,
  title,
  description,
  author,
  duration,
  is_active,
  thumbnail,
  old_thumbnail,
  preview_tmp,
  old_video,
  isVideo
}: {
  id: number;
  sort_order: number;
  title: string;
  description: string;
  author: string;
  duration: string;
  is_active: boolean;
  thumbnail: File | undefined;
  old_thumbnail: string;
  preview_tmp: string;
  old_video: string
  isVideo: boolean
}) => {
  const formData = new FormData();
  formData.append("id", id.toString());
  formData.append("sortOrder", sort_order.toString());
  formData.append("title", title);
  formData.append("description", description);
  formData.append("author", author);
  formData.append("duration", duration);
  formData.append("is_active", is_active.toString());
  formData.append("thumbnail", thumbnail);
  formData.append("old_thumbnail", old_thumbnail);
  formData.append("preview_tmp", preview_tmp);
  formData.append("old_video", old_video);
  formData.append("isVideo", isVideo.toString());
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
  preview: string;
  rating: number;
  num_reviews: number;
  duration: string;
  is_active: boolean;
  sort_order: number;
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

type SearchParamUserCourses = {
  searchParam: string;
  pageParam: number;
  id?: number
}

export const userCourses = async ({
  pageParam = 0,
  searchParam,
}: SearchParamUserCourses): Promise<CourseResponse> => {
  const response = await authAxios.get<CourseResponse>(
    `/courses?cursor=${pageParam}&q=${searchParam}`
  );
  return response.data;
};

export const coursesByUserId = async ({
  pageParam = 0,
  searchParam,
  id
}: SearchParamUserCourses): Promise<CourseResponse> => {
  const response = await authAxios.get<CourseResponse>(
    `/courses/user/${id}?cursor=${pageParam}&q=${searchParam}`
  );
  return response.data;
};

export const adminCourses = async ({
  pageParam = 0,
  searchParam,
  active,
}: SearchParam): Promise<CourseResponse> => {
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
