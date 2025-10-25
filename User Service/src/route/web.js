const express = require("express");
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authmiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const db = require("../models/index");
let router = express.Router();

let initWebRoutes = (app) => {
  // Authentication APIs
  router.post("/api/v1/auth/login", userController.handleLogin);
  router.post("/api/v1/auth/register", userController.handleCreateNewUser);
  router.post("/api/v1/auth/social/google", userController.handleGoogleLogin);
  router.post("/api/v1/auth/logout", userController.handleLogout);
  router.post(
    "/api/v1/auth/forgot-password",
    userController.handleForgotPassword
  );
  router.post(
    "/api/v1/auth/reset-password",
    verifyToken,
    userController.handleResetPassword
  );

  // User Profile APIs
  router.get("/api/v1/profile", verifyToken, userController.handleGetProfile);
  router.put(
    "/api/v1/profile",
    verifyToken,
    userController.handleUpdateProfile
  );

  // User Management APIs (Admin)
  router.get(
    "/api/v1/users",
    verifyToken,
    adminMiddleware,
    userController.handleGetAllUsers
  );
  router.get(
    "/api/v1/users/:id",
    verifyToken,
    adminMiddleware,
    userController.handleGetUserById
  );
  router.put(
    "/api/v1/users/:id",
    verifyToken,
    adminMiddleware,
    userController.handleEditUser
  );
  router.delete(
    "/api/v1/users/:id",
    verifyToken,
    adminMiddleware,
    userController.handleDeleteUser
  );

  // Root endpoint
  router.get("/", (req, res) => {
    return res.send("Hello world");
  });

  return app.use("/", router);
};

module.exports = initWebRoutes;
