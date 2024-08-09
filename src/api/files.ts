import { authAxios } from "@/lib/axiosInstances";


/*
curl -X POST http://localhost:8081/files \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjUxMjQ0OTYsImlhdCI6MTcyMjUzMjQ5NiwibmJmIjoxNzIyNTMyNDk2LCJzdWIiOjF9.ENH-zsDg-s1Z4aKOMP6tnV7Wg91-qaRJHlXvKhc_Uik" \
  -H "Content-Type: multipart/form-data" \
  -F "videoID=2" \
  -F "page=1" \
  -F "path=@/home/agust/Pictures/test.png"
*/

export const uploadFile = async (
  path: File,
  page: number,
  videoID: string,
) => {
  const formData = new FormData();
  formData.append("path", path);
  formData.append("page", page.toString());
  formData.append("videoID", videoID);
  const response = await authAxios.post("/files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/*
curl -X GET "http://localhost:8081/files?page=1&videoID=2" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjUxMjQ0OTYsImlhdCI6MTcyMjUzMjQ5NiwibmJmIjoxNzIyNTMyNDk2LCJzdWIiOjF9.ENH-zsDg-s1Z4aKOMP6tnV7Wg91-qaRJHlXvKhc_Uik" \
  */

export const getFiles = async (page: number, videoID: string) => {
  const response = await authAxios.get(`/files?page=${page}&videoID=${videoID}`);
  return response.data;
}

export const deleteFile = async (id:number) => {
  const response = await authAxios.delete(`/files?id=${id}`);
  return response.data;
}

/*
curl -X DELETE "http://localhost:8081/files?id=1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjUxMjQ0OTYsImlhdCI6MTcyMjUzMjQ5NiwibmJmIjoxNzIyNTMyNDk2LCJzdWIiOjF9.ENH-zsDg-s1Z4aKOMP6tnV7Wg91-qaRJHlXvKhc_Uik" \
  */


