const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const { protect, chefOnly } = require('../middleware/auth.middleware');

router.get('/', recipeController.getAllrecipes);
router.get('/:id', recipeController.getrecipeById);
router.post('/', protect, chefOnly, recipeController.createrecipe);
router.put('/:id', protect, chefOnly, recipeController.updaterecipe);
router.delete('/:id', protect, chefOnly, recipeController.deleterecipe);

module.exports = router;
