const db = require("../config/database");

let likesTableEnsured = false;

const ensureCommentLikesTable = async () => {
  if (likesTableEnsured) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS comment_likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      comment_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_comment_user_like (comment_id, user_id),
      FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  likesTableEnsured = true;
};

const getCommentsByRecipe = async (recipeId, currentUserId = null) => {
  try {
    await ensureCommentLikesTable();

    const [comments] = await db.query(
      `
      SELECT 
        c.id,
        c.text,
        c.rating,
        c.created_at,
        u.id AS user_id,
        u.name AS author,
        COALESCE(lc.likes, 0) AS likes,
        CASE WHEN ul.comment_id IS NULL THEN 0 ELSE 1 END AS liked_by_me
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN (
        SELECT comment_id, COUNT(*) AS likes
        FROM comment_likes
        GROUP BY comment_id
      ) lc ON lc.comment_id = c.id
      LEFT JOIN (
        SELECT comment_id
        FROM comment_likes
        WHERE user_id = ?
      ) ul ON ul.comment_id = c.id
      WHERE c.recipe_id = ?
      ORDER BY c.created_at DESC
      `,
      [currentUserId || 0, recipeId]
    );

    return comments;
  } catch (error) {
    console.error("Error in getCommentsByRecipe:", error.message);
    throw error;
  }
};

const addComment = async ({ recipe_id, user_id, comment, rating }) => {
  try {
    const [result] = await db.query(
      `INSERT INTO comments (recipe_id, user_id, text, rating)
       VALUES (?, ?, ?, ?)`,
      [recipe_id, user_id, comment, rating || null]
    );

    const [rows] = await db.query(
      `
      SELECT 
        c.id,
        c.text,
        c.rating,
        c.created_at,
        u.id AS user_id,
        u.name AS author,
        0 AS likes,
        0 AS liked_by_me
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
      `,
      [result.insertId]
    );

    return rows[0];
  } catch (error) {
    console.error("Error in addComment:", error.message);
    throw error;
  }
};

const deleteComment = async (commentId, requester) => {
  try {
    const [commentRows] = await db.query("SELECT * FROM comments WHERE id = ?", [commentId]);

    if (!commentRows.length) {
      const error = new Error("Comment not found");
      error.statusCode = 404;
      throw error;
    }

    if (commentRows[0].user_id !== requester.id && requester.role !== "admin") {
      const error = new Error("Not allowed");
      error.statusCode = 403;
      throw error;
    }

    await db.query("DELETE FROM comments WHERE id = ?", [commentId]);

    return { message: "Comment deleted" };
  } catch (error) {
    console.error("Error in deleteComment:", error.message);
    throw error;
  }
};

const toggleCommentLike = async (commentId, userId) => {
  try {
    await ensureCommentLikesTable();

    const [commentRows] = await db.query("SELECT id FROM comments WHERE id = ?", [commentId]);

    if (!commentRows.length) {
      const error = new Error("Comment not found");
      error.statusCode = 404;
      throw error;
    }

    const [existingRows] = await db.query(
      "SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?",
      [commentId, userId]
    );

    let liked;

    if (existingRows.length > 0) {
      await db.query("DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?", [commentId, userId]);
      liked = false;
    } else {
      await db.query("INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)", [commentId, userId]);
      liked = true;
    }

    const [countRows] = await db.query(
      "SELECT COUNT(*) AS likes FROM comment_likes WHERE comment_id = ?",
      [commentId]
    );

    return {
      comment_id: Number(commentId),
      liked,
      likes: countRows[0].likes,
    };
  } catch (error) {
    console.error("Error in toggleCommentLike:", error.message);
    throw error;
  }
};

module.exports = {
  getCommentsByRecipe,
  addComment,
  deleteComment,
  toggleCommentLike,
};