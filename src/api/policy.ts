import { authAxios } from "@/lib/axiosInstances";

export const deletePolicyItem = async (id: number) => {
  const response = await authAxios.delete(`/policy/item/${id}`);
  return response.data;
};

export const deletePolicy = async (id: number) => {
  const response = await authAxios.delete(`/policy/${id}`);
  return response.data;
};

export const createPolicyItem = async (body: string, policyId: number) => {
  const response = await authAxios.post(`/policy/create/${policyId}`, {body});
  return response.data;
};

export const createPolicy = async (title: string) => {
  const response = await authAxios.post(`/policy/create`, {title});
  return response.data;
};

export const getPolicyItems = async (policyId: number) => {
  const response = await authAxios.get(`/policy/${policyId}`);
  return response.data;
};

export const getPolicy = async () => {
  const response = await authAxios.get(`/policy`);
  return response.data;
};
