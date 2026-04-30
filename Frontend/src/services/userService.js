import API from "./api";

export const getProfile = () => API.get("/users/profile");

export const updateProfile = (data) => API.put("/users/profile", data);

export const getAllUsers = ({ page = 1, limit = 10, includeInactive = false } = {}) =>
  API.get("/users", {
    params: { page, limit, includeInactive },
  });

export const getUserById = (id) => API.get(`/users/${id}`);

export const getPublicUserProfile = (id) => API.get(`/users/public/${id}`);

export const followUser = (id) => API.post(`/users/${id}/follow`);

export const unfollowUser = (id) => API.delete(`/users/${id}/follow`);

export const createUser = (data) => API.post("/users/create", data);

export const getBookmarks = (id) =>
  API.get(id ? `/users/bookmarks/${id}` : "/users/bookmarks");

export const toggleBookmark = (recipeId) => API.post(`/users/bookmarks/${recipeId}`);

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await API.post("/uploads/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};