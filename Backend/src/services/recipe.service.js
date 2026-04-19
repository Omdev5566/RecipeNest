const store = require('../data/store');
const { v4: uuidv4 } = require('uuid');
const db = require("../config/database")

const getAllRecipes = async (req, res) => {
    const [rows] = await db.query(`
      SELECT 
        r.id,
        r.title,
        r.description,
        r.image_url,
        r.category,
        r.difficulty,
        r.cook_time,
        r.servings,
        r.created_at,
        u.id AS chef_id,
        u.name AS chef_name
      FROM recipes r
      JOIN users u ON r.chef_id = u.id
      ORDER BY r.created_at DESC
    `);
      return rows;
};

// GET FULL RECIPE DETAILS
const getRecipeById = async (recipeId) => {
  // Recipe + Chef
  const [recipeRows] = await db.query(
    `
    SELECT 
      r.*,
      u.name AS chef_name
    FROM recipes r
    JOIN users u ON r.chef_id = u.id
    WHERE r.id = ?
    `,
    [recipeId]
  );

  if (recipeRows.length === 0) {
    return null;
  }

  const recipe = recipeRows[0];

  // Ingredients
  const [ingredients] = await db.query(
    "SELECT ingredient FROM ingredients WHERE recipe_id = ?",
    [recipeId]
  );

  // Instructions
  const [instructions] = await db.query(
    "SELECT step_number, instruction FROM instructions WHERE recipe_id = ? ORDER BY step_number ASC",
    [recipeId]
  );

  // Comments
  const [comments] = await db.query(
    `
    SELECT c.*, u.name 
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.recipe_id = ?
    ORDER BY c.created_at DESC
    `,
    [recipeId]
  );

  return {
    ...recipe,
    ingredients: ingredients.map(i => i.ingredient),
    instructions,
    comments,
  };
};

const createrecipe = (data) => {
  const newrecipe = {
    id: uuidv4(),
    title: data.title,
    description: data.description,
    instructorId: data.instructorId,
    price: data.price,
    createdAt: new Date().toISOString()
  };  
  store.recipes.push(newrecipe);
  return newrecipe;
};

const updaterecipe = (id, data) => {
  const index = store.recipes.findIndex(recipe => recipe.id === id);
  if (index === -1) {
    return null;
  }
  
  const updatedrecipe = {
    ...store.recipes[index],
    title: data.title || store.recipes[index].title,
    description: data.description || store.recipes[index].description,
    instructorId: data.instructorId || store.recipes[index].instructorId,
    price: data.price !== undefined ? data.price : store.recipes[index].price
  };
  
  store.recipes[index] = updatedrecipe;
  return updatedrecipe;
};

const deleterecipe = (id) => {
  const index = store.recipes.findIndex(recipe => recipe.id === id);
  if (index === -1) {
    return false;
  }
  
  store.recipes.splice(index, 1);
  return true;
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createrecipe,
  updaterecipe,
  deleterecipe
};
