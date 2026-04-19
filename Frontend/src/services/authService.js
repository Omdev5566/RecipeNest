import API from "./api";

// login
export const loginUser = (data) => API.post("/users/login", data);

// register
export const registerUser = (data) => API.post("/users/register", data);

// get current user
export const getMe = () => API.get("/users/me");

export const logoutUser = () => {
  return API.post("/users/logout");
};