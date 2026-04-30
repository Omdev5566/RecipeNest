/**
 * Upload Service - Business Logic Layer
 */
const fs = require("fs");
const path = require("path");
const db = require("../config/database");
const { deleteOldFile, getFileUrl, UPLOAD_DIRS } = require("../config/multer.config");

const validateFile = (file, maxSize = 5 * 1024 * 1024) => {
  const errors = [];
  if (!file) errors.push("No file provided");
  if (file && file.size > maxSize) errors.push("File exceeds size limit");
  if (file && !fs.existsSync(file.path)) errors.push("File not found");
  return errors;
};

const validateImageFile = (file) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const allowedExts = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedMimes.includes(file.mimetype)) return "Invalid MIME type";
  if (!allowedExts.includes(ext)) return "Invalid file extension";
  return null;
};

const saveUserAvatar = async (userId, file) => {
  try {
    const errors = validateFile(file);
    if (errors.length > 0) throw new Error(errors.join(", "));
    const imageError = validateImageFile(file);
    if (imageError) throw new Error(imageError);

    const fileName = file.filename;
    const fileUrl = getFileUrl(fileName, "avatar");
    const [currentUser] = await db.query("SELECT profile_image FROM users WHERE id = ?", [userId]);
    
    if (currentUser.length > 0 && currentUser[0].profile_image) {
      const oldFileName = currentUser[0].profile_image.split("/").pop();
      deleteOldFile(oldFileName, "avatar");
    }

    await db.query("UPDATE users SET profile_image = ? WHERE id = ?", [fileUrl, userId]);
    return { success: true, profile_image: fileUrl, fileName: fileName };
  } catch (error) {
    if (file && fs.existsSync(file.path)) deleteOldFile(file.filename, "avatar");
    throw error;
  }
};

const deleteUserAvatar = async (userId) => {
  const [rows] = await db.query("SELECT profile_image FROM users WHERE id = ?", [userId]);
  if (rows.length === 0) throw new Error("User not found");
  if (rows[0].profile_image) {
    const fileName = rows[0].profile_image.split("/").pop();
    deleteOldFile(fileName, "avatar");
  }
  await db.query("UPDATE users SET profile_image = NULL WHERE id = ?", [userId]);
  return { success: true };
};

const getUserAvatar = async (userId) => {
  const [rows] = await db.query("SELECT profile_image FROM users WHERE id = ?", [userId]);
  return rows.length > 0 ? rows[0].profile_image : null;
};

const saveRecipeImage = async (file) => {
  try {
    const errors = validateFile(file);
    if (errors.length > 0) throw new Error(errors.join(", "));
    const imageError = validateImageFile(file);
    if (imageError) throw new Error(imageError);
    const fileName = file.filename;
    const fileUrl = getFileUrl(fileName, "recipe");
    return { success: true, image_url: fileUrl, fileName: fileName, size: file.size, mimetype: file.mimetype };
  } catch (error) {
    if (file && fs.existsSync(file.path)) deleteOldFile(file.filename, "recipe");
    throw error;
  }
};

const updateRecipeImage = async (recipeId, file, userId) => {
  try {
    const errors = validateFile(file);
    if (errors.length > 0) throw new Error(errors.join(", "));
    const imageError = validateImageFile(file);
    if (imageError) throw new Error(imageError);
    const [recipeRows] = await db.query("SELECT * FROM recipes WHERE id = ?", [recipeId]);
    if (recipeRows.length === 0) {
      deleteOldFile(file.filename, "recipe");
      throw new Error("Recipe not found");
    }
    const recipe = recipeRows[0];
    if (Number(recipe.chef_id) !== Number(userId)) {
      deleteOldFile(file.filename, "recipe");
      throw new Error("Not authorized to update this recipe");
    }
    if (recipe.image_url) {
      const oldFileName = recipe.image_url.split("/").pop();
      deleteOldFile(oldFileName, "recipe");
    }
    const fileName = file.filename;
    const fileUrl = getFileUrl(fileName, "recipe");
    await db.query("UPDATE recipes SET image_url = ? WHERE id = ?", [fileUrl, recipeId]);
    return { success: true, image_url: fileUrl, fileName: fileName };
  } catch (error) {
    if (file && fs.existsSync(file.path)) deleteOldFile(file.filename, "recipe");
    throw error;
  }
};

const deleteRecipeImage = async (recipeId, userId) => {
  const [recipeRows] = await db.query("SELECT * FROM recipes WHERE id = ?", [recipeId]);
  if (recipeRows.length === 0) throw new Error("Recipe not found");
  const recipe = recipeRows[0];
  if (Number(recipe.chef_id) !== Number(userId)) throw new Error("Not authorized");
  if (recipe.image_url) {
    const fileName = recipe.image_url.split("/").pop();
    deleteOldFile(fileName, "recipe");
  }
  await db.query("UPDATE recipes SET image_url = NULL WHERE id = ?", [recipeId]);
  return { success: true };
};

const getRecipeImage = async (recipeId) => {
  const [rows] = await db.query("SELECT image_url FROM recipes WHERE id = ?", [recipeId]);
  return rows.length > 0 ? rows[0].image_url : null;
};

const getStorageStats = () => {
  const stats = { avatars: { count: 0, size: 0 }, recipes: { count: 0, size: 0 } };
  if (fs.existsSync(UPLOAD_DIRS.avatars)) {
    fs.readdirSync(UPLOAD_DIRS.avatars).forEach(file => {
      const filePath = path.join(UPLOAD_DIRS.avatars, file);
      const fileStats = fs.statSync(filePath);
      stats.avatars.count++;
      stats.avatars.size += fileStats.size;
    });
  }
  if (fs.existsSync(UPLOAD_DIRS.recipes)) {
    fs.readdirSync(UPLOAD_DIRS.recipes).forEach(file => {
      const filePath = path.join(UPLOAD_DIRS.recipes, file);
      const fileStats = fs.statSync(filePath);
      stats.recipes.count++;
      stats.recipes.size += fileStats.size;
    });
  }
  return {
    success: true,
    stats: {
      total_files: stats.avatars.count + stats.recipes.count,
      total_size_mb: ((stats.avatars.size + stats.recipes.size) / 1024 / 1024).toFixed(2),
      avatars: { count: stats.avatars.count, size_mb: (stats.avatars.size / 1024 / 1024).toFixed(2) },
      recipes: { count: stats.recipes.count, size_mb: (stats.recipes.size / 1024 / 1024).toFixed(2) }
    }
  };
};

const cleanupOrphanedFiles = async () => {
  let deletedCount = 0;
  const [avatarRows] = await db.query("SELECT profile_image FROM users WHERE profile_image IS NOT NULL");
  const [recipeRows] = await db.query("SELECT image_url FROM recipes WHERE image_url IS NOT NULL");
  const dbAvatarFiles = avatarRows.map(r => r.profile_image.split("/").pop());
  const dbRecipeFiles = recipeRows.map(r => r.image_url.split("/").pop());
  if (fs.existsSync(UPLOAD_DIRS.avatars)) {
    fs.readdirSync(UPLOAD_DIRS.avatars).forEach(file => {
      if (!dbAvatarFiles.includes(file)) {
        deleteOldFile(file, "avatar");
        deletedCount++;
      }
    });
  }
  if (fs.existsSync(UPLOAD_DIRS.recipes)) {
    fs.readdirSync(UPLOAD_DIRS.recipes).forEach(file => {
      if (!dbRecipeFiles.includes(file)) {
        deleteOldFile(file, "recipe");
        deletedCount++;
      }
    });
  }
  return { success: true, message: `Cleaned up ${deletedCount} orphaned files`, deletedCount };
};

module.exports = {
  validateFile, validateImageFile, saveUserAvatar, deleteUserAvatar, getUserAvatar,
  saveRecipeImage, updateRecipeImage, deleteRecipeImage, getRecipeImage,
  getStorageStats, cleanupOrphanedFiles
};
