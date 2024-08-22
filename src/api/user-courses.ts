import { authAxios } from "@/lib/axiosInstances";

export const createUserCourse = async (userId: number, courseId: number) => {
  const response = await authAxios.post(`/user/courses/${userId}/${courseId}`);
  return response.data;
};

export const deleteUserCoursesByCourseIdAndUserId = async (userId: number, courseId: number) => {
  const response = await authAxios.delete(`/user/courses/solo/${userId}/${courseId}`);
  return response.data;
};
