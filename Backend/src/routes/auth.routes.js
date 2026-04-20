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
const authController = require("../controllers/auth.controller");

// Import middleware
const { protect, adminOnly } = require("../middleware/auth.middleware");

// Import multer configuration for avatar uploads
const { uploadAvatar } = require("../config/multer.config");

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * POST /api/auth/register
 * Register a new user (student by default)
 * Body: { name, email, password, role }
 */
router.post("/register", authController.register);

/**
 * POST /api/auth/login
 * Login existing user
 * Body: { email, password }
 */
router.post("/login", authController.login);

//Get the user id to verify
router.get("/me", protect, authController.getMe);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 * Note: For JWT, actual logout is done on client by removing token
 */
router.post("/logout", protect, authController.logout);

/**
 * POST /api/auth/change-password
 * Change user's password
 * Body: { currentPassword, newPassword }
 */
router.post("/change-password", protect, authController.changePassword);

// ============================================
// ADMIN ROUTES (Admin authentication required)
// ============================================

/**
 * GET /api/auth
 * Get all auth with pagination
 * Query params: page, limit, includeInactive
 */
// router.get("/", protect, adminOnly, authController.getAllauth);

/**
 * DELETE /api/auth/:id
 * Deactivate (soft delete) a user
 * Note: User is not actually deleted, just marked as inactive
 */
router.delete("/:id", protect, adminOnly, authController.deactivateUser);

// Export router for use in app.js
module.exports = router;