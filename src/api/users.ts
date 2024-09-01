import { authAxios, noAuthAxios } from "@/lib/axiosInstances";
import { SearchParam, UserResponse } from "@/types";

export const updateAdminStatus = async (userId: number, isAdmin: boolean) => {
  const response = await authAxios.put(
    `/users/update/admin/status/${userId}/${isAdmin}`
  );
  return response.data;
};

export const updateSpecialAppUser = async (
  userId: number,
  specialApps: boolean
) => {
  const response = await authAxios.put(
    `/users/update/special/apps/user/${userId}/${specialApps}`
  );
  return response.data;
};

export const updateActiveStatusAllUser = async (active: boolean) => {
  const response = await authAxios.put(`/users/update/all/active/status/${active}`);
  return response.data;
};

export const updateActiveStatus = async (userId: number) => {
  const response = await authAxios.put(`/users/update/active/status/${userId}`);
  return response.data;
};

export const adminUsers = async ({
  pageParam = 0,
  searchParam,
  active,
  admin,
  special,
  verified,
}: SearchParam): Promise<UserResponse> => {
  const response = await authAxios.get<UserResponse>(
    `/users/admin?cursor=${pageParam}&q=${searchParam}&a=${active}&admin=${admin}&special=${special}&verified=${verified}`
  );
  return response.data;
};

export const updatePassword = async (password: string) => {
  const response = await authAxios.put("/users/update/password", {
    password,
  });
  return response.data;
};

export const deleteAccountByEmail = async (email: string) => {
  const response = await noAuthAxios.post(
    `/users/delete/account/by/email/${email}`
  );
  return response.data;
};

export const resendEmail = async (email: string) => {
  const response = await noAuthAxios.post(`/users/resend/email/token/${email}`);
  return response.data;
};

export const verifyAccount = async (email: string, emailToken: number) => {
  const response = await noAuthAxios.post("/users/verify", {
    email,
    email_token: emailToken,
  });
  return response.data;
};

export const signUp = async (
  email: string,
  name: string,
  surname: string,
  password: string,
  pc: string,
  os: string
) => {
  const response = await noAuthAxios.post("/users/signup", {
    email,
    name,
    surname,
    password,
    pc,
    os,
  });
  return response.data;
};

export const login = async (email: string, password: string, pc: string) => {
  const response = await noAuthAxios.post("/users/login", {
    email,
    password,
    pc,
  });
  return response.data;
};
