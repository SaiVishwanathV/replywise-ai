import api from "./api";

export const generateReplyApi = async (data) => {
  const res = await api.post("/email/reply", data);
  return res.data;
};

export const rewriteReplyApi = async (data) => {
  const res = await api.post("/email/rewrite", data);
  return res.data;
};

export const summarizeEmailApi = async (data) => {
  const res = await api.post("/email/summary", data);
  return res.data;
};
