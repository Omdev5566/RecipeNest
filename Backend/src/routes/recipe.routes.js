const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');

router.get('/', recipeController.getAllrecipes);
router.get('/:id', recipeController.getrecipeById);
router.post('/', recipeController.createrecipe);
router.put('/:id', recipeController.updaterecipe);
router.delete('/:id', recipeController.deleterecipe);

module.exports = router;
