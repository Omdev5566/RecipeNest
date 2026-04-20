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

// Import multer configuration for avatar uploads
const { uploadAvatar } = require("../config/multer.config");

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
 * PUT /api/users/profile
 * Update current user's profile (text fields only)
 * Body: { name, phone, address }
 */
router.put("/profile", protect, userController.updateProfile);

/**
 * PATCH /api/users/avatar
 * Update user's avatar/profile picture
 * Content-Type: multipart/form-data
 * Field name: 'avatar'
 * 
 * This route uses multer middleware to handle file upload:
 * - uploadAvatar.single('avatar') processes a single file from the 'avatar' field
 * - File is validated (type, size) and saved to uploads/avatars directory
 * - File info is available in req.file after upload
 */
// router.patch(
//   "/avatar",
//   protect,
//   uploadAvatar.single("avatar"), // Multer middleware for single file upload
//   userController.updateAvatar
// );

/**
 * DELETE /api/users/avatar
 * Remove user's avatar (reset to default)
 */
// router.delete("/avatar", protect, userController.deleteAvatar);


// ============================================
// ADMIN ROUTES (Admin authentication required)
// ============================================

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