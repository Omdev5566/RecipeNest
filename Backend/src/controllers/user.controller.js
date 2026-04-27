 const userService = require("../services/user.service");
const { NODE_ENV } = require("../config/config");

const handleError = (res, error) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

const validateUpdateProfile = (data) => {
  const errors = [];
  const allowedFields = ["name", "phone", "location", "bio", "profile_image"];
  
  const updateKeys = Object.keys(data);
  const invalidFields = updateKeys.filter(key => !allowedFields.includes(key));
  
  if (invalidFields.length > 0) {
    errors.push(`Cannot update these fields: ${invalidFields.join(", ")}`);
  }
  
  return errors;
};

const getProfile = async (req, res) => {
  try {
    const result = await userService.getUserProfile(req.user.id, req.user.id);
    res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    handleError(res, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    // Simple validation
    const errors = validateUpdateProfile(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    const result = await userService.updateUserProfile(req.user.id, req.body);
    res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    handleError(res, error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const options = {
      page: req.query.page,
      limit: req.query.limit,
    };
    const result = await userService.getAllUsers(options);
    res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    handleError(res, error);
  }
};

const getUserById = async (req, res) => {
  try {
    const result = await userService.getUserProfile(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    handleError(res, error);
  }
};

const getPublicUserProfile = async (req, res) => {
  try {
    const result = await userService.getUserProfile(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    handleError(res, error);
  }
};

const followUser = async (req, res) => {
  try {
    const result = await userService.followUser(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    handleError(res, error);
  }
};

const unfollowUser = async (req, res) => {
  try {
    const result = await userService.unfollowUser(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    handleError(res, error);
  }
};

const getBookmarks = async (req, res) => {
  try {
    const result = await userService.getBookmarks(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    handleError(res, error);
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const data = await userService.getAdminDashboard();
    res.status(200).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const data = await userService.getAdminUsers({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      role: req.query.role,
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

const updateAdminUserRole = async (req, res) => {
  try {
    if (!req.body.role) {
      return res.status(400).json({
        success: false,
        message: "role is required",
      });
    }

    const user = await userService.updateAdminUserRole(req.params.id, req.body.role, req.user.id);
    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: { user },
    });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteAdminUser = async (req, res) => {
  try {
    await userService.deleteAdminUser(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getAdminRecipes = async (req, res) => {
  try {
    const data = await userService.getAdminRecipes({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteAdminRecipe = async (req, res) => {
  try {
    await userService.deleteAdminRecipe(req.params.id);
    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getAdminComments = async (req, res) => {
  try {
    const data = await userService.getAdminComments({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteAdminComment = async (req, res) => {
  try {
    await userService.deleteAdminComment(req.params.id);
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};



const createUser = async (req, res) => {
  try {
    // Simple validation (same as register)
    const errors = validateRegister(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    const { name, email, password, role } = req.body;
    const result = await userService.registerUser({ name, email, password, role });
    res.status(201).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    handleError(res, error);
  }
};



module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  getPublicUserProfile,
  followUser,
  unfollowUser,
  createUser,
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
