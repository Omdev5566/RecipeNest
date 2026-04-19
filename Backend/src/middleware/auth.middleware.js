const jwt = require("jsonwebtoken");
const db = require("../config/database"); // your mysql pool
const { JWT_SECRET } = require("../config/config");

const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ CHANGE: read from cookies instead of headers
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    // verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // fetch user from DB (same as yours)
    const [rows] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [decoded.id]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found with this token.",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Token invalid or expired.",
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") return next();

  return res.status(403).json({
    success: false,
    message: "Admin access required",
  });
};

const chefOnly = (req, res, next) => {
  if (req.user?.role === "chef" || req.user?.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Chef access required",
  });
};

module.exports = {
  protect,
  adminOnly,
  chefOnly,
};