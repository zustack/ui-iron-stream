import { authAxios } from "@/lib/axiosInstances";

type Video = {
  id: number;
  title: string;
  description: string;
  views: number;
  thumbnail: string;
  duration: string;
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
  active: number | string;
}

export const adminVideos = async ({
  pageParam = 0,
  searchParam,
  active,
}: SearchParam): Promise<VideoResponse> => {
  const response = await authAxios.get<VideoResponse>(
    `/videos/admin?cursor=${pageParam}&q=${searchParam}&a=${active}`
  );
  return response.data;
};

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

