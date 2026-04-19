import API from "./api";

export const getCommentsByRecipe = (recipeId, viewerId) =>
  API.get(`/comments/recipe/${recipeId}`, {
    params: viewerId ? { viewerId } : undefined,
  });

export const addComment = (payload) =>
  API.post(`/comments`, payload);

export const toggleCommentLike = (commentId) =>
  API.post(`/comments/${commentId}/like`);
