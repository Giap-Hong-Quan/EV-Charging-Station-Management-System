const express = require("express");
const userController = require("../controllers/userController");

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", (req, res) => {
    return res.send("Hello world");
  });

  router.post("/api/login", userController.handleLogin);
  router.post("/api/create-new-user", userController.handleCreateNewUser);

  return app.use("/", router);
};

module.exports = initWebRoutes;
