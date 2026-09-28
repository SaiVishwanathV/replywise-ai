import api from "./api";

export const signupApi = async (userData) => {
  const res = await api.post("/auth/signup", userData);
  return res.data;
};

export const loginApi = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const logoutApi = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("token");
  }
};

export const verifyOtpApi = async (otpData) => {
  const res = await api.post("/auth/verify-otp", otpData);
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const resendOtpApi = async (email) => {
  const res = await api.post("/auth/resend-otp", { email });
  return res.data;
};

export const forgotPasswordApi = async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPasswordApi = async (resetData) => {
  const res = await api.post("/auth/reset-password", resetData);
  return res.data;
};

export const getMeApi = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const updateProfileApi = async (profileData) => {
  const res = await api.patch("/profile", profileData);
  return res.data;
};

export const updatePasswordApi = async (passwordData) => {
  const res = await api.patch("/profile/password", passwordData);
  return res.data;
};
