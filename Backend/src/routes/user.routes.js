/**
 * User Routes
 * 
 * This file defines all API endpoints related to user management.
 * Routes are organized by access level:
 * - Public: Registration and login
 * - Protected: User profile management
 * - Admin: User administration
 */

const express = require("express");
const router = express.Router();

// Import controllers
const userController = require("../controllers/user.controller");

// Import middleware
const { protect, adminOnly } = require("../middleware/auth.middleware");

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * POST /api/users/create
 * Create a new user (alternative endpoint)
 * Body: { name, email, password, role }
 */
router.post("/create", userController.createUser);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

/**
 * GET /api/users/profile
 * Get current user's profile
 */
router.get("/profile", protect, userController.getProfile);

/**
 * GET /api/users/public/:id
 * Get another user's public profile (logged-in users)
 */
router.get("/public/:id", protect, userController.getPublicUserProfile);

/**
 * POST /api/users/:id/follow
 * Follow a user
 */
router.post("/:id/follow", protect, userController.followUser);

/**
 * DELETE /api/users/:id/follow
 * Unfollow a user
 */
router.delete("/:id/follow", protect, userController.unfollowUser);

/**
 * GET /api/users/bookmarks/:id?
 * Get bookmarked recipes for the current user or a specific user
 */
router.get("/bookmarks", protect, userController.getBookmarks);
router.get("/bookmarks/:id", protect, userController.getBookmarks);

/**
 * POST /api/users/bookmarks/:recipeId
 * Toggle bookmark state for a recipe
 */
router.post("/bookmarks/:recipeId", protect, userController.toggleBookmark);

/**
 * PUT /api/users/profile
 * Update current user's profile (text fields only)
 * Body: { name, phone, address }
 */
router.put("/profile", protect, userController.updateProfile);

/**
 * PATCH /api/uploads/avatar
 * Update user's avatar/profile picture
 * Content-Type: multipart/form-data
 * Field name: 'avatar'
 * 
 * This route uses multer middleware to handle file upload:
 * - uploadAvatar.single('avatar') processes a single file from the 'avatar' field
 * - File is validated (type, size) and saved to uploads/avatars directory
 * - File info is available in req.file after upload
 * 
 * ⚠️ Note: Use POST /api/uploads/avatar instead (see upload.routes.js)
 */
// router.patch(
//   "/avatar",
//   protect,
//   uploadAvatar.single("avatar"), // Multer middleware for single file upload
//   userController.updateAvatar
// );

/**
 * DELETE /api/uploads/avatar
 * Remove user's avatar (reset to default)
 * 
 * ⚠️ Note: Use DELETE /api/uploads/avatar instead (see upload.routes.js)
 */
// router.delete("/avatar", protect, userController.deleteAvatar);


// ============================================
// ADMIN ROUTES (Admin authentication required)
// ============================================

router.get("/admin/dashboard", protect, adminOnly, userController.getAdminDashboard);
router.get("/admin/users", protect, adminOnly, userController.getAdminUsers);
router.patch("/admin/users/:id/role", protect, adminOnly, userController.updateAdminUserRole);
router.delete("/admin/users/:id", protect, adminOnly, userController.deleteAdminUser);

router.get("/admin/recipes", protect, adminOnly, userController.getAdminRecipes);
router.delete("/admin/recipes/:id", protect, adminOnly, userController.deleteAdminRecipe);

router.get("/admin/comments", protect, adminOnly, userController.getAdminComments);
router.delete("/admin/comments/:id", protect, adminOnly, userController.deleteAdminComment);

/**
 * GET /api/users
 * Get all users with pagination
 * Query params: page, limit, includeInactive
 */
router.get("/", protect, adminOnly, userController.getAllUsers);

/**
 * GET /api/users/:id
 * Get specific user by ID
 */
router.get("/:id", protect, adminOnly, userController.getUserById);


// Export router for use in app.js
module.exports = router;