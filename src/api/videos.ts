import { authAxios } from "@/lib/axiosInstances";

export const getVideosByCourseId = async (courseId: string) => {
  const response = await authAxios.get(`/videos/${courseId}`);
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

