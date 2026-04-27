const db = require("../config/database"); // mysql2 promise pool

const mapUserRow = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  phone: row.phone,
  location: row.location,
  bio: row.bio,
  profile_image: row.profile_image,
  created_at: row.created_at,
});

const mapRecipeCardRow = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  image: row.image_url,
  category: row.category,
  difficulty: row.difficulty,
  cook_time: row.cook_time,
  servings: row.servings,
  chef_name: row.chef_name,
  created_at: row.created_at,
});

const mapProfileSummaryRow = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  phone: row.phone,
  location: row.location,
  bio: row.bio,
  profile_image: row.profile_image,
});

const getUserProfile = async (userId, viewerId = userId) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, email, role, phone, location, bio, profile_image, created_at
       FROM users
       WHERE id = ?`,
      [userId],
    );

    if (rows.length === 0) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const user = mapUserRow(rows[0]);

    const [followStateRows] = await db.query(
      "SELECT COUNT(*) AS total FROM followers WHERE follower_id = ? AND following_id = ?",
      [viewerId, userId],
    );

    const [preferenceRows] = await db.query(
      `SELECT up.skill_level,
              GROUP_CONCAT(DISTINCT dp.name ORDER BY dp.name SEPARATOR ', ') AS dietary_preferences
       FROM user_preferences up
       LEFT JOIN user_dietary_preferences udp ON udp.user_id = up.user_id
       LEFT JOIN dietary_preferences dp ON dp.id = udp.preference_id
       WHERE up.user_id = ?
       GROUP BY up.user_id, up.skill_level`,
      [userId],
    );

    const [bookmarkRows] = await db.query(
      "SELECT COUNT(*) AS total_bookmarks FROM bookmarks WHERE user_id = ?",
      [userId],
    );

    const [commentRows] = await db.query(
      "SELECT COUNT(*) AS total_comments FROM comments WHERE user_id = ?",
      [userId],
    );

    const [cookedRows] = await db.query(
      "SELECT COUNT(*) AS total_cooked FROM cooked_recipes WHERE user_id = ?",
      [userId],
    );

    const [createdRows] = await db.query(
      "SELECT COUNT(*) AS total_created FROM recipes WHERE chef_id = ?",
      [userId],
    );

    const [followersRows] = await db.query(
      "SELECT COUNT(*) AS followers_count FROM followers WHERE following_id = ?",
      [userId],
    );

    const [followingRows] = await db.query(
      "SELECT COUNT(*) AS following_count FROM followers WHERE follower_id = ?",
      [userId],
    );

    const [followersListRows] = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.phone, u.location, u.bio, u.profile_image
       FROM followers f
       JOIN users u ON u.id = f.follower_id
       WHERE f.following_id = ?
       ORDER BY u.created_at DESC`,
      [userId],
    );

    const [followingListRows] = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.phone, u.location, u.bio, u.profile_image
       FROM followers f
       JOIN users u ON u.id = f.following_id
       WHERE f.follower_id = ?
       ORDER BY u.created_at DESC`,
      [userId],
    );

    const [bookmarkedRecipeRows] = await db.query(
      `SELECT r.id, r.title, r.description, r.image_url, r.category, r.difficulty,
              r.cook_time, r.servings, r.created_at, u.name AS chef_name, b.id AS bookmark_id
       FROM bookmarks b
       JOIN recipes r ON r.id = b.recipe_id
       LEFT JOIN users u ON u.id = r.chef_id
       WHERE b.user_id = ?
       ORDER BY b.id DESC`,
      [userId],
    );

    const [cookedRecipeRows] = await db.query(
      `SELECT r.id, r.title, r.description, r.image_url, r.category, r.difficulty,
              r.cook_time, r.servings, r.created_at, u.name AS chef_name
       FROM cooked_recipes cr
       JOIN recipes r ON r.id = cr.recipe_id
       LEFT JOIN users u ON u.id = r.chef_id
       WHERE cr.user_id = ?
       ORDER BY cr.cooked_at DESC`,
      [userId],
    );

    const [createdRecipeRows] = await db.query(
      `SELECT r.id, r.title, r.description, r.image_url, r.category, r.difficulty,
              r.cook_time, r.servings, r.created_at, u.name AS chef_name
       FROM recipes r
       LEFT JOIN users u ON u.id = r.chef_id
       WHERE r.chef_id = ?
       ORDER BY r.created_at DESC`,
      [userId],
    );

    const [recentCommentRows] = await db.query(
      `SELECT c.id, c.text, c.rating, c.created_at, r.id AS recipe_id, r.title AS recipe_title
       FROM comments c
       LEFT JOIN recipes r ON r.id = c.recipe_id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC
       LIMIT 5`,
      [userId],
    );

    const [recentCookedRows] = await db.query(
      `SELECT cr.id, cr.cooked_at, r.id AS recipe_id, r.title AS recipe_title
       FROM cooked_recipes cr
       LEFT JOIN recipes r ON r.id = cr.recipe_id
       WHERE cr.user_id = ?
       ORDER BY cr.cooked_at DESC
       LIMIT 5`,
      [userId],
    );

    const [recentFollowerRows] = await db.query(
      `SELECT f.id, u.id AS user_id, u.name AS user_name
       FROM followers f
       LEFT JOIN users u ON u.id = f.follower_id
       WHERE f.following_id = ?
       ORDER BY f.id DESC
       LIMIT 5`,
      [userId],
    );

    const recentActivity = [
      ...recentCommentRows.map((row) => ({
        type: "comment",
        id: row.id,
        title: `Reviewed \"${row.recipe_title || "Recipe"}\"`,
        text: row.text,
        rating: row.rating,
        created_at: row.created_at,
        recipe_id: row.recipe_id,
      })),
      ...recentCookedRows.map((row) => ({
        type: "cooked",
        id: row.id,
        title: `Cooked \"${row.recipe_title || "Recipe"}\"`,
        created_at: row.cooked_at,
        recipe_id: row.recipe_id,
      })),
      ...bookmarkedRecipeRows.map((row) => ({
        type: "bookmark",
        id: row.bookmark_id,
        title: `Saved \"${row.title}\"`,
        created_at: row.bookmarked_at,
        recipe_id: row.id,
      })),
      ...recentFollowerRows.map((row) => ({
        type: "follower",
        id: row.id,
        title: `${row.user_name || "Someone"} started following you`,
        created_at: row.created_at,
        user_id: row.user_id,
      })),
    ]
      .filter((item) => item.created_at)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 6);

    const preferences = preferenceRows[0]
      ? {
          skill_level: preferenceRows[0].skill_level,
          dietary_preferences: preferenceRows[0].dietary_preferences
            ? preferenceRows[0].dietary_preferences.split(", ")
            : [],
        }
      : {
          skill_level: null,
          dietary_preferences: [],
        };

    return {
      success: true,
      data: {
        user: {
          ...user,
          preferences,
          stats: {
            bookmarks: bookmarkRows[0]?.total_bookmarks || 0,
            comments: commentRows[0]?.total_comments || 0,
            cooked_recipes: cookedRows[0]?.total_cooked || 0,
            created_recipes: createdRows[0]?.total_created || 0,
            followers: followersRows[0]?.followers_count || 0,
            following: followingRows[0]?.following_count || 0,
          },
          relationship: {
            is_self: Number(viewerId) === Number(userId),
            can_follow: Number(viewerId) !== Number(userId),
            is_following: (followStateRows[0]?.total || 0) > 0,
          },
          followers_list: followersListRows.map(mapProfileSummaryRow),
          following_list: followingListRows.map(mapProfileSummaryRow),
          bookmarked_recipes: bookmarkedRecipeRows.map(mapRecipeCardRow),
          cooked_recipes: cookedRecipeRows.map(mapRecipeCardRow),
          created_recipes: createdRecipeRows.map(mapRecipeCardRow),
          recent_activity: recentActivity,
        },
      },
    };
  } catch (error) {
    console.error("Error in getUserProfile:", error.message);
    throw error;
  }
};

const getAllUsers = async (options = {}) => {
  try {
    const page = Math.max(parseInt(options.page, 10) || 1, 1);
    const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
    const offset = (page - 1) * limit;

    const [countRows] = await db.query("SELECT COUNT(*) AS total FROM users");

    const total = countRows[0]?.total || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    const [rows] = await db.query(
      `SELECT id, name, email, role, phone, location, bio, profile_image, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    return {
      success: true,
      data: {
        users: rows.map(mapUserRow),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  } catch (error) {
    console.error("Error in getAllUsers:", error.message);
    throw error;
  }
};

const updateUserProfile = async (userId, updateData) => {
  try {
    const allowedFields = ["name", "phone", "location", "bio", "profile_image"];

    const fields = [];
    const values = [];

    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    }

    if (fields.length === 0) {
      const error = new Error("No valid fields to update");
      error.statusCode = 400;
      throw error;
    }

    values.push(userId);

    const [result] = await db.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const updatedUser = await getUserProfile(userId, userId);

    return {
      success: true,
      message: "Profile updated successfully",
      data: updatedUser.data,
    };
  } catch (error) {
    console.error("Error in updateUserProfile:", error.message);
    throw error;
  }
};

const followUser = async (followerId, followingId) => {
  try {
    if (Number(followerId) === Number(followingId)) {
      const error = new Error("You cannot follow yourself");
      error.statusCode = 400;
      throw error;
    }

    const [userRows] = await db.query("SELECT id FROM users WHERE id = ?", [
      followingId,
    ]);
    if (userRows.length === 0) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const [existingRows] = await db.query(
      "SELECT id FROM followers WHERE follower_id = ? AND following_id = ?",
      [followerId, followingId],
    );

    if (existingRows.length === 0) {
      await db.query(
        "INSERT INTO followers (follower_id, following_id) VALUES (?, ?)",
        [followerId, followingId],
      );
    }

    return {
      success: true,
      message: "Followed user successfully",
    };
  } catch (error) {
    console.error("Error in followUser:", error.message);
    throw error;
  }
};

const unfollowUser = async (followerId, followingId) => {
  try {
    await db.query(
      "DELETE FROM followers WHERE follower_id = ? AND following_id = ?",
      [followerId, followingId],
    );

    return {
      success: true,
      message: "Unfollowed user successfully",
    };
  } catch (error) {
    console.error("Error in unfollowUser:", error.message);
    throw error;
  }
};

const getBookmarks = async (userId, viewerId = userId) => {
  try {
    const [bookmarkedRecipeRows] = await db.query(
      `SELECT r.id, r.title, r.description, r.image_url, r.category, r.difficulty,
              r.cook_time, r.servings, r.created_at, u.name AS chef_name, b.id AS bookmark_id
       FROM bookmarks b
       JOIN recipes r ON r.id = b.recipe_id
       LEFT JOIN users u ON u.id = r.chef_id
       WHERE b.user_id = ?
       ORDER BY b.id DESC`,
      [userId],
    );
    return{
      success: true,
      message: "Bookmarks get Successfully",
      data: bookmarkedRecipeRows
    }
  } catch (err) {
    console.error("Error getting bookmmarks:", error.message);
    throw error;
  }
};

const getAdminDashboard = async () => {
  const [userCountRows] = await db.query("SELECT COUNT(*) AS total FROM users");
  const [chefCountRows] = await db.query(
    "SELECT COUNT(*) AS total FROM users WHERE role = 'chef'"
  );
  const [adminCountRows] = await db.query(
    "SELECT COUNT(*) AS total FROM users WHERE role = 'admin'"
  );
  const [recipeCountRows] = await db.query("SELECT COUNT(*) AS total FROM recipes");
  const [commentCountRows] = await db.query("SELECT COUNT(*) AS total FROM comments");

  const [recentUsers] = await db.query(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY created_at DESC
     LIMIT 5`
  );

  const [recentRecipes] = await db.query(
    `SELECT r.id, r.title, r.category, r.created_at, u.name AS chef_name
     FROM recipes r
     LEFT JOIN users u ON u.id = r.chef_id
     ORDER BY r.created_at DESC
     LIMIT 5`
  );

  const [topCategories] = await db.query(
    `SELECT category, COUNT(*) AS total
     FROM recipes
     GROUP BY category
     ORDER BY total DESC
     LIMIT 6`
  );

  return {
    stats: {
      total_users: userCountRows[0]?.total || 0,
      total_chefs: chefCountRows[0]?.total || 0,
      total_admins: adminCountRows[0]?.total || 0,
      total_recipes: recipeCountRows[0]?.total || 0,
      total_comments: commentCountRows[0]?.total || 0,
    },
    recent_users: recentUsers,
    recent_recipes: recentRecipes,
    top_categories: topCategories,
  };
};

const getAdminUsers = async (options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(options.limit, 10) || 10, 1), 50);
  const offset = (page - 1) * limit;

  const where = [];
  const params = [];

  if (options.search) {
    where.push("(name LIKE ? OR email LIKE ?)");
    params.push(`%${options.search}%`, `%${options.search}%`);
  }

  if (options.role && ["user", "chef", "admin"].includes(options.role)) {
    where.push("role = ?");
    params.push(options.role);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM users ${whereSql}`,
    params
  );

  const [rows] = await db.query(
    `SELECT id, name, email, role, phone, location, bio, profile_image, created_at
     FROM users
     ${whereSql}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const total = countRows[0]?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    users: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

const updateAdminUserRole = async (userId, role, actorId) => {
  const allowedRoles = ["user", "chef", "admin"];
  if (!allowedRoles.includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  const [rows] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
  if (!rows.length) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (Number(actorId) === Number(userId) && role !== "admin") {
    const error = new Error("You cannot remove your own admin role");
    error.statusCode = 400;
    throw error;
  }

  await db.query("UPDATE users SET role = ? WHERE id = ?", [role, userId]);
  const [updatedRows] = await db.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
    [userId]
  );

  return updatedRows[0];
};

const deleteAdminUser = async (userId, actorId) => {
  if (Number(userId) === Number(actorId)) {
    const error = new Error("You cannot delete your own account");
    error.statusCode = 400;
    throw error;
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [userRows] = await connection.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (!userRows.length) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const [recipeRows] = await connection.query("SELECT id FROM recipes WHERE chef_id = ?", [userId]);
    const recipeIds = recipeRows.map((row) => row.id);

    if (recipeIds.length) {
      const placeholders = recipeIds.map(() => "?").join(",");
      await connection.query(`DELETE FROM instructions WHERE recipe_id IN (${placeholders})`, recipeIds);
      await connection.query(`DELETE FROM ingredients WHERE recipe_id IN (${placeholders})`, recipeIds);
      await connection.query(`DELETE FROM comments WHERE recipe_id IN (${placeholders})`, recipeIds);
      await connection.query(`DELETE FROM bookmarks WHERE recipe_id IN (${placeholders})`, recipeIds);
      await connection.query(`DELETE FROM cooked_recipes WHERE recipe_id IN (${placeholders})`, recipeIds);
      await connection.query(`DELETE FROM recipes WHERE id IN (${placeholders})`, recipeIds);
    }

    await connection.query("DELETE FROM followers WHERE follower_id = ? OR following_id = ?", [
      userId,
      userId,
    ]);
    await connection.query("DELETE FROM comment_likes WHERE user_id = ?", [userId]);
    await connection.query("DELETE FROM comments WHERE user_id = ?", [userId]);
    await connection.query("DELETE FROM bookmarks WHERE user_id = ?", [userId]);
    await connection.query("DELETE FROM cooked_recipes WHERE user_id = ?", [userId]);
    await connection.query("DELETE FROM user_dietary_preferences WHERE user_id = ?", [userId]);
    await connection.query("DELETE FROM user_preferences WHERE user_id = ?", [userId]);
    await connection.query("DELETE FROM users WHERE id = ?", [userId]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getAdminRecipes = async (options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(options.limit, 10) || 10, 1), 50);
  const offset = (page - 1) * limit;

  const where = [];
  const params = [];

  if (options.search) {
    where.push("(r.title LIKE ? OR r.category LIKE ? OR u.name LIKE ?)");
    params.push(`%${options.search}%`, `%${options.search}%`, `%${options.search}%`);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total
     FROM recipes r
     LEFT JOIN users u ON u.id = r.chef_id
     ${whereSql}`,
    params
  );

  const [rows] = await db.query(
    `SELECT r.id, r.title, r.category, r.difficulty, r.cook_time, r.servings, r.created_at,
            u.id AS chef_id, u.name AS chef_name
     FROM recipes r
     LEFT JOIN users u ON u.id = r.chef_id
     ${whereSql}
     ORDER BY r.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const total = countRows[0]?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    recipes: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

const deleteAdminRecipe = async (recipeId) => {
  const [existingRows] = await db.query("SELECT id FROM recipes WHERE id = ?", [recipeId]);
  if (!existingRows.length) {
    const error = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  await db.query("DELETE FROM instructions WHERE recipe_id = ?", [recipeId]);
  await db.query("DELETE FROM ingredients WHERE recipe_id = ?", [recipeId]);
  await db.query("DELETE FROM comments WHERE recipe_id = ?", [recipeId]);
  await db.query("DELETE FROM bookmarks WHERE recipe_id = ?", [recipeId]);
  await db.query("DELETE FROM cooked_recipes WHERE recipe_id = ?", [recipeId]);
  await db.query("DELETE FROM recipes WHERE id = ?", [recipeId]);
};

const getAdminComments = async (options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(options.limit, 10) || 10, 1), 50);
  const offset = (page - 1) * limit;

  const where = [];
  const params = [];

  if (options.search) {
    where.push("(c.text LIKE ? OR u.name LIKE ? OR r.title LIKE ?)");
    params.push(`%${options.search}%`, `%${options.search}%`, `%${options.search}%`);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total
     FROM comments c
     LEFT JOIN users u ON u.id = c.user_id
     LEFT JOIN recipes r ON r.id = c.recipe_id
     ${whereSql}`,
    params
  );

  const [rows] = await db.query(
    `SELECT c.id, c.text, c.rating, c.created_at,
            u.id AS user_id, u.name AS user_name,
            r.id AS recipe_id, r.title AS recipe_title
     FROM comments c
     LEFT JOIN users u ON u.id = c.user_id
     LEFT JOIN recipes r ON r.id = c.recipe_id
     ${whereSql}
     ORDER BY c.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const total = countRows[0]?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    comments: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

const deleteAdminComment = async (commentId) => {
  const [existingRows] = await db.query("SELECT id FROM comments WHERE id = ?", [commentId]);
  if (!existingRows.length) {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }

  await db.query("DELETE FROM comments WHERE id = ?", [commentId]);
};

module.exports = {
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  followUser,
  unfollowUser,
  getBookmarks,
  getAdminDashboard,
  getAdminUsers,
  updateAdminUserRole,
  deleteAdminUser,
  getAdminRecipes,
  deleteAdminRecipe,
  getAdminComments,
  deleteAdminComment,
};
