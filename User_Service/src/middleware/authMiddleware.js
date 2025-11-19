// middleware/authmiddleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        errCode: 6,
        message: "Authentication error: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        errCode: 6,
        message: "Authentication error: Token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        errCode: 6,
        message: "Authentication error: Invalid token",
      });
    }

    return res.status(401).json({
      errCode: 6,
      message: "Authentication error",
    });
  }
};

module.exports = { verifyToken };
