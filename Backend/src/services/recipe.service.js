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

const createrecipe = async (data) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [recipeResult] = await connection.query(
      `INSERT INTO recipes (title, description, image_url, category, difficulty, cook_time, servings, chef_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.description,
        data.image_url,
        data.category,
        data.difficulty,
        data.cook_time,
        data.servings,
        data.chef_id,
      ],
    );

    const recipeId = recipeResult.insertId;

    if (Array.isArray(data.ingredients) && data.ingredients.length > 0) {
      const ingredientValues = data.ingredients
        .filter((item) => item && item.trim() !== "")
        .map((ingredient) => [recipeId, ingredient.trim()]);

      if (ingredientValues.length > 0) {
        await connection.query(
          "INSERT INTO ingredients (recipe_id, ingredient) VALUES ?",
          [ingredientValues],
        );
      }
    }

    if (Array.isArray(data.instructions) && data.instructions.length > 0) {
      const instructionValues = data.instructions
        .filter((item) => item && item.trim() !== "")
        .map((instruction, index) => [recipeId, index + 1, instruction.trim()]);

      if (instructionValues.length > 0) {
        await connection.query(
          "INSERT INTO instructions (recipe_id, step_number, instruction) VALUES ?",
          [instructionValues],
        );
      }
    }

    await connection.commit();

    return getRecipeById(recipeId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const updaterecipe = async (id, data) => {
  const [existingRows] = await db.query("SELECT id FROM recipes WHERE id = ?", [id]);
  if (!existingRows.length) {
    return null;
  }

  const fields = [];
  const values = [];

  const fieldMap = {
    title: "title",
    description: "description",
    image_url: "image_url",
    category: "category",
    difficulty: "difficulty",
    cook_time: "cook_time",
    servings: "servings",
  };

  Object.entries(fieldMap).forEach(([inputKey, dbField]) => {
    if (data[inputKey] !== undefined) {
      fields.push(`${dbField} = ?`);
      values.push(data[inputKey]);
    }
  });

  if (fields.length > 0) {
    values.push(id);
    await db.query(`UPDATE recipes SET ${fields.join(", ")} WHERE id = ?`, values);
  }

  if (Array.isArray(data.ingredients)) {
    await db.query("DELETE FROM ingredients WHERE recipe_id = ?", [id]);
    const ingredientValues = data.ingredients
      .filter((item) => item && item.trim() !== "")
      .map((ingredient) => [id, ingredient.trim()]);
    if (ingredientValues.length > 0) {
      await db.query("INSERT INTO ingredients (recipe_id, ingredient) VALUES ?", [ingredientValues]);
    }
  }

  if (Array.isArray(data.instructions)) {
    await db.query("DELETE FROM instructions WHERE recipe_id = ?", [id]);
    const instructionValues = data.instructions
      .filter((item) => item && item.trim() !== "")
      .map((instruction, index) => [id, index + 1, instruction.trim()]);
    if (instructionValues.length > 0) {
      await db.query(
        "INSERT INTO instructions (recipe_id, step_number, instruction) VALUES ?",
        [instructionValues],
      );
    }
  }

  return getRecipeById(id);
};

const deleterecipe = async (id) => {
  const [existingRows] = await db.query("SELECT id FROM recipes WHERE id = ?", [id]);
  if (!existingRows.length) {
    return false;
  }

  await db.query("DELETE FROM instructions WHERE recipe_id = ?", [id]);
  await db.query("DELETE FROM ingredients WHERE recipe_id = ?", [id]);
  await db.query("DELETE FROM comments WHERE recipe_id = ?", [id]);
  await db.query("DELETE FROM bookmarks WHERE recipe_id = ?", [id]);
  await db.query("DELETE FROM cooked_recipes WHERE recipe_id = ?", [id]);
  await db.query("DELETE FROM recipes WHERE id = ?", [id]);

  return true;
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createrecipe,
  updaterecipe,
  deleterecipe
};
