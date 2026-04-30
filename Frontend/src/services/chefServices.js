import API from "./api";

const getApiOrigin = () => {
  const baseUrl = API?.defaults?.baseURL;
  if (!baseUrl) return "";

  try {
    const parsed = new URL(baseUrl, window.location.origin);
    return parsed.origin;
  } catch {
    return "";
  }
};

const toAbsoluteUploadUrl = (value) => {
  if (!value) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;

  const origin = getApiOrigin();
  return origin ? `${origin}${value}` : value;
};

const normalizeRecipe = (recipe) => ({
  ...recipe,
  image: toAbsoluteUploadUrl(recipe.image || recipe.image_url),
  image_url: toAbsoluteUploadUrl(recipe.image_url || recipe.image),
});

export const getChefProfile = async () => {
  const res = await API.get("/users/profile");
  return res.data?.data?.user;
};

export const updateChefProfile = (payload) => API.put("/users/profile", payload);

export const getChefRecipes = async () => {
  const profile = await getChefProfile();
  const createdRecipes = profile?.created_recipes || [];
  return createdRecipes.map(normalizeRecipe);
};

export const getAllRecipesForAnalytics = async () => {
  const res = await API.get("/recipes");
  const rows = Array.isArray(res.data) ? res.data : [];
  return rows.map(normalizeRecipe);
};

export const createChefRecipe = async (payload) => {
  const body = {
    title: payload.title,
    description: payload.description,
    image_url: payload.image_url,
    category: payload.category,
    difficulty: payload.difficulty,
    cook_time: Number(payload.cook_time),
    servings: Number(payload.servings),
    ingredients: payload.ingredients,
    instructions: payload.instructions,
    chef_id: Number(payload.chef_id),
  };

  const res = await API.post("/recipes", body);
  return normalizeRecipe(res.data);
};

export const uploadChefRecipeImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await API.post("/uploads/recipe", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const imageUrl = res?.data?.data?.image_url;
  return toAbsoluteUploadUrl(imageUrl);
};

export const getChefRecipeById = async (recipeId) => {
  const res = await API.get(`/recipes/${recipeId}`);
  return normalizeRecipe(res.data);
};

export const updateChefRecipe = async (recipeId, payload) => {
  const body = {
    title: payload.title,
    description: payload.description,
    image_url: payload.image_url,
    category: payload.category,
    difficulty: payload.difficulty,
    cook_time: Number(payload.cook_time),
    servings: Number(payload.servings),
    ingredients: payload.ingredients,
    instructions: payload.instructions,
  };

  const res = await API.put(`/recipes/${recipeId}`, body);
  return normalizeRecipe(res.data);
};

export const deleteChefRecipe = (recipeId) => API.delete(`/recipes/${recipeId}`);
