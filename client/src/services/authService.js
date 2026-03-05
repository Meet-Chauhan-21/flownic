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

// Chat API functions
export const createNewChat = async (message) => {
  const response = await api.post("/chat/new", { message });
  return response.data;
};

export const sendChatMessage = async (conversationId, message) => {
  const response = await api.post(`/chat/${conversationId}/message`, { message });
  return response.data;
};

export const getConversation = async (conversationId) => {
  const response = await api.get(`/chat/${conversationId}`);
  return response.data;
};

export const getChatHistory = async () => {
  const response = await api.get("/chat/history");
  return response.data;
};

export const deleteConversation = async (conversationId) => {
  const response = await api.delete(`/chat/${conversationId}`);
  return response.data;
};

export const renameConversation = async (conversationId, title) => {
  const response = await api.put(`/chat/${conversationId}/rename`, { title });
  return response.data;
};
