/**
 * Upload Controller - Request Handler Layer
 */
const uploadService = require("../services/upload.service");

const handleError = (res, error, statusCode = 500) => {
  console.error("Upload error:", error.message);
  res.status(statusCode).json({ success: false, message: error.message });
};

// AVATAR HANDLERS
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return handleError(res, new Error("No file uploaded"), 400);
    const result = await uploadService.saveUserAvatar(req.user.id, req.file);
    res.status(200).json({ success: true, message: "Avatar uploaded successfully", data: result });
  } catch (error) {
    handleError(res, error, 400);
  }
};

const deleteAvatar = async (req, res) => {
  try {
    await uploadService.deleteUserAvatar(req.user.id);
    res.status(200).json({ success: true, message: "Avatar deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

const getMyAvatar = async (req, res) => {
  try {
    const profileImage = await uploadService.getUserAvatar(req.user.id);
    res.status(200).json({ success: true, data: { profile_image: profileImage } });
  } catch (error) {
    handleError(res, error);
  }
};

// RECIPE IMAGE HANDLERS
const uploadRecipeImage = async (req, res) => {
  try {
    if (!req.file) return handleError(res, new Error("No file uploaded"), 400);
    const result = await uploadService.saveRecipeImage(req.file);
    res.status(200).json({ success: true, message: "Recipe image uploaded successfully", data: result });
  } catch (error) {
    handleError(res, error, 400);
  }
};

const updateRecipeImage = async (req, res) => {
  try {
    if (!req.file) return handleError(res, new Error("No file uploaded"), 400);
    const result = await uploadService.updateRecipeImage(req.params.recipeId, req.file, req.user.id);
    res.status(200).json({ success: true, message: "Recipe image updated successfully", data: result });
  } catch (error) {
    if (error.message === "Not authorized to update this recipe") return handleError(res, error, 403);
    handleError(res, error, 400);
  }
};

const deleteRecipeImage = async (req, res) => {
  try {
    await uploadService.deleteRecipeImage(req.params.recipeId, req.user.id);
    res.status(200).json({ success: true, message: "Recipe image deleted successfully" });
  } catch (error) {
    if (error.message === "Not authorized") return handleError(res, error, 403);
    handleError(res, error);
  }
};

const getRecipeImage = async (req, res) => {
  try {
    const imageUrl = await uploadService.getRecipeImage(req.params.recipeId);
    res.status(200).json({ success: true, data: { image_url: imageUrl } });
  } catch (error) {
    handleError(res, error);
  }
};

// STORAGE MANAGEMENT
const getStorageStats = async (req, res) => {
  try {
    const stats = uploadService.getStorageStats();
    res.status(200).json(stats);
  } catch (error) {
    handleError(res, error);
  }
};

const cleanupOrphanedFiles = async (req, res) => {
  try {
    const result = await uploadService.cleanupOrphanedFiles();
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  uploadAvatar, deleteAvatar, getMyAvatar,
  uploadRecipeImage, updateRecipeImage, deleteRecipeImage, getRecipeImage,
  getStorageStats, cleanupOrphanedFiles
};
