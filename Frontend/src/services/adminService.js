import API from "./api";

const buildParams = (params = {}) => {
  const cleaned = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const getAdminDashboard = async () => {
  const res = await API.get("/users/admin/dashboard");
  return res.data?.data;
};

export const getAdminUsers = async (options = {}) => {
  const res = await API.get("/users/admin/users", {
    params: buildParams(options),
  });
  return res.data?.data;
};

export const updateAdminUserRole = async (userId, role) => {
  const res = await API.patch(`/users/admin/users/${userId}/role`, { role });
  return res.data?.data?.user;
};

export const deleteAdminUser = (userId) => API.delete(`/users/admin/users/${userId}`);

export const getAdminRecipes = async (options = {}) => {
  const res = await API.get("/users/admin/recipes", {
    params: buildParams(options),
  });
  return res.data?.data;
};

export const deleteAdminRecipe = (recipeId) => API.delete(`/users/admin/recipes/${recipeId}`);

export const getAdminComments = async (options = {}) => {
  const res = await API.get("/users/admin/comments", {
    params: buildParams(options),
  });
  return res.data?.data;
};

export const deleteAdminComment = (commentId) => API.delete(`/users/admin/comments/${commentId}`);
