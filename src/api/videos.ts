import { authAxios } from "@/lib/axiosInstances";

export const deleteVideo = async (id: number) => {
  const response = await authAxios.delete(`/videos/${id}`);
  return response.data;
};

export const updateHistory = async (
  id: string,
  resume: string,
) => {
  const response = await authAxios.put("/history/update", {
    resume,
    id
  });
  return response.data;
};

export const updateVideo = async ({
  id,
  title,
  description,
  course_id,
  duration,
  thumbnail,
  old_thumbnail,
  old_video,
  video_tmp,
}: {
  id:number
  title: string;
  description: string;
  course_id: string;
  duration: string;
  thumbnail: File;
  old_thumbnail: string;
  old_video: string
  video_tmp: string;
}) => {
  const formData = new FormData();
  formData.append("id", id.toString())
  formData.append("title", title);
  formData.append("description", description);
  formData.append("duration", duration);
  formData.append("course_id", course_id);
  formData.append("thumbnail", thumbnail);
  formData.append("old_thumbnail", old_thumbnail);
  formData.append("old_video", old_video);
  formData.append("video_tmp", video_tmp);

  const response = await authAxios.put("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const createVideo = async ({
  title,
  description,
  course_id,
  duration,
  thumbnail,
  video_tmp,
}: {
  title: string;
  description: string;
  course_id: string;
  duration: string;
  thumbnail: File;
  video_tmp: string;
}) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("duration", duration);
  formData.append("course_id", course_id);
  formData.append("thumbnail", thumbnail);
  formData.append("video_tmp", video_tmp);

  const response = await authAxios.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

type Video = {
  id: number;
  title: string;
  description: string;
  views: number;
  thumbnail: string;
  duration: string;
  video_hls: string
  created_at: string;
};

type VideoResponse = {
  data: Video[];
  totalCount: number;
  previousId: number | null;
  nextId: number | null;
}

type SearchParam = {
  searchParam: string;
  pageParam: number;
  courseId: string;
}

export const adminVideos = async ({
  pageParam = 0,
  searchParam,
  courseId,
}: SearchParam): Promise<VideoResponse> => {
  const response = await authAxios.get<VideoResponse>(
    `/videos/admin/${courseId}?cursor=${pageParam}&q=${searchParam}`
  );
  return response.data;
};

export const userVideos = async ({
  pageParam = 0,
  searchParam,
  courseId,
}: SearchParam): Promise<VideoResponse> => {
  const response = await authAxios.get<VideoResponse>(
    `/videos/${courseId}?cursor=${pageParam}&q=${searchParam}`
  );
  return response.data;
};

export const getVideosByCourseId = async (courseId: string, searchParam: string) => {
  const response = await authAxios.get(`/videos/feed/${courseId}?q=${searchParam}`);
  return response.data;
};

export const getCurrentVideo = async (courseID: string) => {
  const response = await authAxios.get(`/history/current/${courseID}`);
  return response.data;
};

export const newVideo = async (
  id: string,
  video_id: string,
  course_id: string,
  resume: string,
  current_video_id: number,
) => {
  const response = await authAxios.put(`history/watch`, {
    id: id,
    video_id: video_id,
    course_id: course_id,
    resume: resume,
    current_video_id: current_video_id
  });
  return response.data;
};

