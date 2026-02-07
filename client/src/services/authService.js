import api from "./api.js";

export const signIn = async (payload) => {
  const response = await api.post("/auth/signin", payload);
  return response.data;
};

export const signUp = async (payload) => {
  const response = await api.post("/auth/signup", payload);
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.get("/auth/verify-email", {
    params: { token }
  });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const signOut = async () => {
  const response = await api.post("/auth/signout");
  return response.data;
};
