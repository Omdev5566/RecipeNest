import API from "./api";

// login
export const loginUser = (data) => API.post("/auth/login", data);

// register
export const registerUser = (data) => API.post("/auth/register", data);

// get current user
export const getMe = () => API.get("/auth/me");

export const logoutUser = () => {
  return API.post("/auth/logout");
};