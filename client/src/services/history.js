import api from "./api";

export const getHistoryApi = async (params) => {
  const res = await api.get("/history", { params });
  return res.data;
};

export const deleteHistoryApi = async (id) => {
  const res = await api.delete(`/history/${id}`);
  return res.data;
};
