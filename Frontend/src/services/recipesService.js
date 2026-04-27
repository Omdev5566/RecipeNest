import API from "./api";

// get Recipe all
export const getAllRecipes = (data) => API.get("/recipes/", data);

// get Recipe by id
export const getRecipeById = (id) => API.get(`/recipes/${id}`);
