const jwt = require("jsonwebtoken");
const db = require("../models/index");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({
        errCode: 1,
        message: "Missing token",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if session exists and is not expired
    const session = await db.AuthSession.findOne({
      where: {
        token: token,
        expires_at: {
          [db.Sequelize.Op.gt]: new Date(),
        },
      },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "email", "fullName"],
        },
      ],
    });

    if (!session) {
      return res.status(401).json({
        errCode: 2,
        message: "Invalid or expired session",
      });
    }

    if (!session.user) {
      return res.status(401).json({
        errCode: 3,
        message: "User not found",
      });
    }

    // Get user role
    const userRole = await db.UserRole.findOne({
      where: { user_id: decoded.id },
      order: [["created_at", "DESC"]],
    });

    req.user = {
      ...decoded,
      role: userRole ? userRole.role : "driver",
      session: session,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        errCode: 4,
        message: "Token expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        errCode: 5,
        message: "Invalid token",
      });
    } else {
      return res.status(500).json({
        errCode: 6,
        message: "Authentication error",
      });
    }
  }
};

module.exports = { verifyToken };
