const { login } = require("../controllers/user.controller");
const User = require("../models/user.models");

const registerUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      const error = new Error("User already exists with this email");
      error.statusCode = 400;
      throw error;
    }

    const user = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || "student",
    });

    await user.save();
    const token = user.generateToken();

    return {
      success: true,
      message: "User registered successfully",
      data: { user, token },
    };
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select("+password");

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

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = user.generateToken();
    const userObject = user.toObject();
    delete userObject.password;

    return {
      success: true,
      message: "Login successful",
      data: { user: userObject, token },
    };
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    throw error;
  }
};

const updateUserProfile = async (userId, updateData) => {
  try {
    const allowedUpdates = ["name", "phone", "address", "avatar"];
    const filteredData = {};
    for (const key of allowedUpdates) {
      if (updateData[key] !== undefined) {
        filteredData[key] = updateData[key];
      }
    }

    const user = await User.findByIdAndUpdate(userId, filteredData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return {
      success: true,
      message: "Profile updated successfully",
      data: { user },
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

