const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const { protect, chefOnly } = require('../middleware/auth.middleware');

// Import multer for recipe image uploads
const { uploadrecipeImage } = require('../config/multer.config');
const uploadController = require('../controllers/upload.controller');

/**
 * ============================================
 * RECIPE CRUD ROUTES
 * ============================================
 */

router.get('/', recipeController.getAllrecipes);
router.get('/:id', recipeController.getrecipeById);
router.post('/', protect, chefOnly, recipeController.createrecipe);
router.put('/:id', protect, chefOnly, recipeController.updaterecipe);
router.delete('/:id', protect, chefOnly, recipeController.deleterecipe);

/**
 * ============================================
 * RECIPE IMAGE UPLOAD ROUTES
 * ============================================
 */

/**
 * POST /api/recipes/upload-image
 * Upload recipe image
 * 
 * Headers: Authorization: Bearer <token>
 * Content-Type: multipart/form-data
 * Field name: 'recipe_image'
 * 
 * Chef-only endpoint
 * 
 * ⚠️ Note: Better to use POST /api/uploads/recipe (see upload.routes.js)
 */
// router.post(
//   '/upload-image',
//   protect,
//   chefOnly,
//   uploadrecipeImage.single('recipe_image'),
//   uploadController.uploadRecipeImage
// );

module.exports = router;
