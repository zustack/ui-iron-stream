import { noAuthAxios } from "@/lib/axiosInstances";

export const register = async (
  email: string,
  fullName: string,
  password: string,
  pc: string
) => {
  const response = await noAuthAxios.post("/register", {
    email,
    username: fullName,
    name: fullName,
    surname: fullName,
    password,
    pc
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

