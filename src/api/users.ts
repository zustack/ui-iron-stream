import { noAuthAxios } from "@/lib/axiosInstances";

export const login = async (
  username: string,
  password: string,
  serialNumber: string
) => {
  const response = await noAuthAxios.post("/login", {
    username,
    password,
    pc: serialNumber,
  });
  return response;
};
