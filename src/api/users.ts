import { authAxios, noAuthAxios } from "@/lib/axiosInstances";

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

