import { api } from "./api";

export const pingApi = () => api.get("/");

export const registerApi = ({ name, username, email, password, profilePicture }) => {
  const fd = new FormData();
  fd.append("name", name);
  fd.append("username", username);
  fd.append("email", email);
  fd.append("password", password);
  if (profilePicture) fd.append("profilePicture", profilePicture);

  return api.post("/user/register", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const loginApi = ({ email, password }) => api.post("/user/login", { email, password });

export const logoutApi = () => api.post("/user/logout");

export const refreshTokenApi = () => api.post("/user/refresh-token");