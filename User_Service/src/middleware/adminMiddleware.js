const adminMiddleware = (req, res, next) => {
  try {
    // Kiểm tra nếu user có role_id = 1 (admin) hoặc role = 'admin'
    if (req.user.role_id === 1 || req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        errCode: 1,
        errMessage: "Access denied. Admin role required.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Error validating admin role",
    });
  }
};

module.exports = { adminMiddleware };
