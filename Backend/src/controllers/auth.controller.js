const authService = require("../services/auth.service");
const { NODE_ENV } = require("../config/config");

// Simple validation helper - easy for beginners to understand
const validateRegister = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim() === "") {
    errors.push("Name is required");
  }
  
  if (!data.email || data.email.trim() === "") {
    errors.push("Email is required");
  } else if (!data.email.includes("@")) {
    errors.push("Please provide a valid email address");
  }
  
  if (!data.password || data.password === "") {
    errors.push("Password is required");
  } else if (data.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  
  return errors;
};

const validateLogin = (data) => {
  const errors = [];
  
  if (!data.email || data.email.trim() === "") {
    errors.push("Email is required");
  }
  
  if (!data.password || data.password === "") {
    errors.push("Password is required");
  }
  
  return errors;
};



const validateChangePassword = (data) => {
  const errors = [];
  
  if (!data.currentPassword || data.currentPassword === "") {
    errors.push("Current password is required");
  }
  
  if (!data.newPassword || data.newPassword === "") {
    errors.push("New password is required");
  } else if (data.newPassword.length < 6) {
    errors.push("New password must be at least 6 characters");
  }
  
  return errors;
};

const handleError = (res, error) => {
  console.error("Controller Error:", error.message);
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    ...(NODE_ENV === "development" && { stack: error.stack }),
  });
};

const register = async (req, res) => {
  try {
    // Simple validation
    const errors = validateRegister(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    const { name, email, password, role } = req.body;
    const result = await authService.registerUser({ name, email, password, role });
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Registration successful",
      data: result.user,
    });
    } catch (error) {
    handleError(res, error);
  }
};

const login = async (req, res) => {
  try {
    // validation
    const errors = validateLogin(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const { email, password } = req.body;
    console.log("email and pass", email, password);

    const result = await authService.loginUser(email, password);

    // set cookie HERE (not in service)
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result.user,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getMe = (req, res) => {
  res.json(req.user);
};


const changePassword = async (req, res) => {
  try {
    // Simple validation
    const errors = validateChangePassword(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    handleError(res, error);
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // true in production (HTTPS)
    sameSite: "Strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


const deactivateUser = async (req, res) => {
  try {
    const result = await authService.deactivateUser(req.params.id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  changePassword,
  deactivateUser,
  logout,
};