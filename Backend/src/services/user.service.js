const db = require("../config/database"); // mysql2 promise pool
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");
  const registerUser = async (userData) => {
    try {
      // check existing user
      const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
        userData.email,
      ]);

      if (existing.length > 0) {
        const error = new Error("User already exists with this email");
        error.statusCode = 400;
        throw error;
      }
          // 🔐 hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // insert user
      const [result] = await db.query(
        `INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)`,
        [
          userData.name,
          userData.email,
          hashedPassword,
          userData.role || "student",
        ],
      );

      // fetch inserted user
      const [rows] = await db.query(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        [result.insertId],
      );

      const user = rows[0];

      const token = generateToken(user); // replace with your JWT function

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
    } catch (error) {
      console.error("Error in registerUser:", error.message);
      throw error;
    }
  };

  const loginUser = async (email, password) => {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const user = rows[0];

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error("Your account has been deactivated");
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  };

const updateUserProfile = async (userId, updateData) => {
  try {
    const allowedFields = ["name", "phone", "address", "avatar"];

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

    const [rows] = await db.query(
      "SELECT id, name, email, role, phone, address, avatar FROM users WHERE id = ?",
      [userId],
    );

    return {
      success: true,
      message: "Profile updated successfully",
      data: { user: rows[0] },
    };
  } catch (error) {
    console.error("Error in updateUserProfile:", error.message);
    throw error;
  }
};

module.exports = {
  registerUser,
  updateUserProfile,
  loginUser,
};
