const express = require("express");
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authmiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Authentication APIs
router.post("/auth/login", userController.handleLogin);

router.post(
  "/auth/register",
  upload.single("avatar"),
  userController.handleCreateNewUser
);

router.post("/auth/social/google", userController.handleGoogleLogin);
router.post("/auth/logout", userController.handleLogout);
router.post("/auth/forgot-password", userController.handleForgotPassword);

router.post(
  "/auth/reset-password",
  verifyToken,
  userController.handleResetPassword
);

// User Profile
router.get("/profile", verifyToken, userController.handleGetProfile);

router.put(
  "/profile",
  verifyToken,
  upload.single("avatar"),
  userController.handleUpdateProfile
);

// Admin - User Management
router.get(
  "/users",
  verifyToken,
  adminMiddleware,
  userController.handleGetAllUsers
);

router.get(
  "/users/:id",
  verifyToken,
  adminMiddleware,
  userController.handleGetUserById
);

router.put(
  "/users/:id",
  verifyToken,
  adminMiddleware,
  userController.handleEditUser
);

router.delete(
  "/users/:id",
  verifyToken,
  adminMiddleware,
  userController.handleDeleteUser
);

// Default route
router.get("/", (req, res) => {
  res.send("Hello world");
});

module.exports = router;
