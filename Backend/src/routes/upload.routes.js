/**
 * Upload Routes - API Endpoint Definitions
 */
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const uploadController = require("../controllers/upload.controller");
const { uploadAvatar, uploadrecipeImage } = require("../config/multer.config");

// AVATAR MANAGEMENT
router.post("/avatar", protect, uploadAvatar.single("avatar"), uploadController.uploadAvatar);
router.delete("/avatar", protect, uploadController.deleteAvatar);
router.get("/avatar/me", protect, uploadController.getMyAvatar);

// RECIPE IMAGE MANAGEMENT 
router.post("/recipe", protect, uploadrecipeImage.single("image"), uploadController.uploadRecipeImage);
router.put("/recipe/:recipeId", protect, uploadrecipeImage.single("image"), uploadController.updateRecipeImage);
router.delete("/recipe/:recipeId", protect, uploadController.deleteRecipeImage);
router.get("/recipe/:recipeId", uploadController.getRecipeImage);

// ADMIN - STORAGE STATS & CLEANUP
router.get("/stats", protect, uploadController.getStorageStats);
router.post("/cleanup", protect, uploadController.cleanupOrphanedFiles);

module.exports = router;
