import { authAxios } from "@/lib/axiosInstances";

export const updateSReview= async (id: number, s_review: boolean) => {
  const response = await authAxios.put(`/videos/s_review/${id}/${s_review}`);
  return response.data;
};

export const deleteVideo = async (id: number) => {
  const response = await authAxios.delete(`/videos/${id}`);
  return response.data;
};

// this should be in history.ts
export const updateHistory = async (id: string, resume: string) => {
  const response = await authAxios.put("/history/update", {
    resume,
    id,
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
  id: number;
  title: string;
  description: string;
  course_id: string;
  duration: string;
  thumbnail?: File;
  old_thumbnail: string;
  old_video: string;
  video_tmp: string;
}) => {
  const formData = new FormData();
  formData.append("id", id.toString());
  formData.append("title", title);
  formData.append("description", description);
  formData.append("duration", duration);
  formData.append("course_id", course_id);
  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }
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


export const adminVideos = async (searchParam: string, courseId?: string) => {
  const response = await authAxios.get(
    `/videos/admin/${courseId}?q=${searchParam}`
  );
  return response.data;
};

export const userVideos = async (searchParam: string, courseId?: string) => {
  const response = await authAxios.get(
    `/videos/${courseId}?q=${searchParam}`
  );
  return response.data;
};

export const getVideosByCourseId = async (
  courseId: string,
  searchParam: string
) => {
  const response = await authAxios.get(
    `/videos/feed/${courseId}?q=${searchParam}`
  );
  return response.data;
};

export const getCurrentVideo = async (courseID: string) => {
  const response = await authAxios.get(`/history/current/${courseID}`);
  return response.data;
};

export const newVideo = async (
  history_id: string,
  video_id: number,
  course_id: string,
  resume: string,
  current_video_id: number
) => {
  const response = await authAxios.put(`history/watch`, {
    history_id: history_id,
    video_id: video_id,
    course_id: course_id,
    resume: resume,
    current_video_id: current_video_id,
  });
  return response.data;
};
