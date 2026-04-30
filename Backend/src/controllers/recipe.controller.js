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

const createrecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      image_url,
      category,
      difficulty,
      cook_time,
      servings,
      ingredients,
      instructions,
    } = req.body;

    if (!title || !description || !category || !difficulty || !cook_time || !servings) {
      return res.status(400).json({
        error: "title, description, category, difficulty, cook_time and servings are required",
      });
    }

    const newrecipe = await recipeservice.createrecipe({
      title,
      description,
      image_url,
      category,
      difficulty,
      cook_time,
      servings,
      ingredients,
      instructions,
        chef_id: req.user.id,
    });

    res.status(201).json(newrecipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updaterecipe = async (req, res) => {
  try {
    const existingRecipe = await recipeservice.getRecipeById(req.params.id);
    if (!existingRecipe) {
      return res.status(404).json({ error: "recipe not found" });
    }

    if (req.user.role !== "admin" && Number(existingRecipe.chef_id) !== Number(req.user.id)) {
      return res.status(403).json({ error: "Not allowed to update this recipe" });
    }

    const updatedrecipe = await recipeservice.updaterecipe(req.params.id, req.body);

    if (!updatedrecipe) {
      return res.status(404).json({ error: "recipe not found" });
    }

    res.status(200).json(updatedrecipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleterecipe = async (req, res) => {
  try {
    const existingRecipe = await recipeservice.getRecipeById(req.params.id);
    if (!existingRecipe) {
      return res.status(404).json({ error: "recipe not found" });
    }

    if (req.user.role !== "admin" && Number(existingRecipe.chef_id) !== Number(req.user.id)) {
      return res.status(403).json({ error: "Not allowed to delete this recipe" });
    }

    const success = await recipeservice.deleterecipe(req.params.id);

    if (!success) {
      return res.status(404).json({ error: "recipe not found" });
    }

    res.status(200).json({ message: "recipe deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllrecipes,
  getrecipeById,
  createrecipe,
  updaterecipe,
  deleterecipe
};
