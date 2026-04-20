const recipeservice = require('../services/recipe.service');

const getAllrecipes = async (req, res) => {
  try {
    const recipes = await recipeservice.getAllRecipes();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getrecipeById = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipe = await recipeservice.getRecipeById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createrecipe = (req, res) => {
  const { title, description, instructorId, price } = req.body;
  
  // Basic validation
  if (!title || !description || !instructorId || price === undefined) {
    return res.status(400).json({ error: 'Title, description, instructorId, and price are required' });
  }

  const newrecipe = recipeservice.createrecipe({ title, description, instructorId, price });
  res.status(201).json(newrecipe);
};

const updaterecipe = (req, res) => {
  const { title, description, instructorId, price } = req.body;
  
  const updatedrecipe = recipeservice.updaterecipe(req.params.id, { title, description, instructorId, price });
  
  if (!updatedrecipe) {
    return res.status(404).json({ error: 'recipe not found' });
  }
  
  res.status(200).json(updatedrecipe);
};

const deleterecipe = (req, res) => {
  const success = recipeservice.deleterecipe(req.params.id);
  
  if (!success) {
    return res.status(404).json({ error: 'recipe not found' });
  }
  
  res.status(200).json({ message: 'recipe deleted successfully' });
};

module.exports = {
  getAllrecipes,
  getrecipeById,
  createrecipe,
  updaterecipe,
  deleterecipe
};
