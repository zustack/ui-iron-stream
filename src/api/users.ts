import { authAxios, noAuthAxios } from "@/lib/axiosInstances";

export const deactivateCourseForAllUsers = async(id:number) => {
  const response = await authAxios.put(`/deactivate/course/for/all/users/${id}`);
  return response.data;
}

export const deactivateAllCourses = async() => {
  const response = await authAxios.put("/deactivate/all/courses");
  return response.data;
}

export const updateActiveStatusAllUser = async(isActive: boolean) => {
  const formData = new FormData();
  formData.append("isActive", isActive.toString());
  const response = await authAxios.put("/update/active/status", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export const updateActiveStatus = async (
  user_id: number,
) => {
  const response = await authAxios.put(`/update/active/status/${user_id}`);
  return response.data;
};

export const addCourseToUser = async (
  user_id: number,
  course_id: number
) => {
  const response = await authAxios.put("/courses/add/user", {
    user_id,
    course_id
  });
  return response.data;
};

type User = {
  id: number;
  email: string;
  name: string;
  surname: string;
  thumbnail: string;
  isAdmin: boolean;
  specialApps: boolean;
  isActive: boolean;
  verified: boolean;
  pc: string;
  os: string;
  created_at: string;
};

type UserResponse = {
  data: User[];
  totalCount: number;
  previousId: number | null;
  nextId: number | null;
}

type SearchParam = {
  searchParam: string;
  pageParam: number;
  active: number | string;
  admin: number | string;
  special: number | string;
  verified: number | string;
}

export const adminUsers = async ({
  pageParam = 0,
  searchParam,
  active,
  admin,
  special,
  verified
}: SearchParam): Promise<UserResponse> => {
  const response = await authAxios.get<UserResponse>(
    `/users/admin?cursor=${pageParam}&q=${searchParam}&a=${active}&admin=${admin}&special=${special}&verified=${verified}`
  );
  return response.data;
};

export const requestEmailTokenResetPassword = async (
  email: string,
) => {
  const response = await noAuthAxios.put("request/email/token/reset/password", {
    email,
  });
  return response.data;
};


export const updatePassword = async (
  password: string,
) => {
  const response = await authAxios.put("/update/password", {
    password,
  });
  return response.data;
};


export const deleteAccountAtRegister = async (
  email: string,
) => {
  const response = await noAuthAxios.post("/delete/account/at/register", {
    email,
  });
  return response.data;
};


export const resendEmail = async (
  email: string,
) => {
  const response = await noAuthAxios.post("/resend/email/token", {
    email,
  });
  return response.data;
};


export const verifyAccount = async (
  email: string,
  emailToken: number
) => {
  const response = await noAuthAxios.post("/verify", {
    email,
    email_token: emailToken
  });
  return response.data;
};


export const register = async (
  email: string,
  name: string,
  surname: string,
  password: string,
  pc: string,
  os: string,
) => {
  const response = await noAuthAxios.post("/register", {
    email,
    name,
    surname,
    password,
    pc,
    os
  });
  return response.data;
};

export const login = async (
  email: string,
  password: string,
  pc: string
) => {
  const response = await noAuthAxios.post("/login", {
    email,
    password,
    pc
  });
  return response.data;
};

