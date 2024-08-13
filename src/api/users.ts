import { authAxios, noAuthAxios } from "@/lib/axiosInstances";


export const updateActiveStatus = async (
  user_id: number,
) => {
  const response = await authAxios.put(`/update/active/status/${user_id}`);
  return response.data;
};

/*
curl -X PUT "http://localhost:8081/courses/add/user" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjUxMzU0OTgsImlhdCI6MTcyMjU0MzQ5OCwibmJmIjoxNzIyNTQzNDk4LCJzdWIiOjF9.V1BbfsZ3-ZbNxJrU-TvrYrWmaWmsY128NHQYAZXV_Vc" \
  -d '{"user_id": 1, "course_id": 5}'
*/

export const addCourseToUser = async (
  user_id: string,
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

/*
curl -X GET "http://localhost:8081/users/admin?cursor=0&q=admin&a=&admin=&special=&verified="  \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjYxNTM3MTksImlhdCI6MTcyMzU2MTcxOSwibmJmIjoxNzIzNTYxNzE5LCJzdWIiOjJ9.B1M7lPBPLbzC4D1qS4a1HZJjwPFuWY99vtBS_YhTo_o" | jq
*/

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

