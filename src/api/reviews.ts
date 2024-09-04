import { authAxios } from "@/lib/axiosInstances";

export const deleteReview = async (id: number) => {
  const response = await authAxios.delete(`/reviews/${id}`);
  return response.data;
};

export const updatePublicStatus = async (status: boolean, id: number) => {
  const response = await authAxios.put(`/reviews/update/public/${status}/${id}`);
  return response.data;
};

export const adminReviews = async (searchParam: string, status: string) => {
  const response = await authAxios.get(
    `/reviews/admin?q=${searchParam}&p=${status}`
  );
  return response.data;
};

export const getPublicReviews = async (courseId: string) => {
  const response = await authAxios.get(`/reviews/public/${courseId}`);
  return response.data;
};

export const createReview = async (
  description: string,
  rating: number,
  courseId: string
) => {
  const response = await authAxios.post(`/reviews`, {
    description,
    rating,
    course_id: courseId,
  });
  return response.data;
};
