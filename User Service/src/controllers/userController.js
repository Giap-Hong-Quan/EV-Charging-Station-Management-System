import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter",
    });
  }

  let userData = await userService.handleUserLogin(email, password);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
    token: userData.token ? userData.token : {},
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  if (!req.params.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
    });
  }
  let message = await userService.deleteUser(req.params.id);
  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  let data = req.body;
  data.id = req.params.id;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};

let handleGoogleLogin = async (req, res) => {
  try {
    let message = await userService.handleGoogleLogin(req.body);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Error from server",
    });
  }
};

let handleLogout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    let message = await userService.handleLogout(token);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Error from server",
    });
  }
};

let handleForgotPassword = async (req, res) => {
  try {
    let message = await userService.handleForgotPassword(req.body.email);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Error from server",
    });
  }
};

let handleGetProfile = async (req, res) => {
  try {
    let userData = await userService.getUserProfile(req.user.id);
    return res.status(200).json({
      errCode: 0,
      message: "OK",
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Error from server",
    });
  }
};

let handleUpdateProfile = async (req, res) => {
  try {
    let data = req.body;
    data.id = req.user.id;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Error from server",
    });
  }
};

let handleGetAllUsers = async (req, res) => {
  try {
    let users = await userService.getAllUsers();
    return res.status(200).json({
      errCode: 0,
      message: "OK",
      users: users,
    });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Error from server",
    });
  }
};

let handleGetUserById = async (req, res) => {
  try {
    let user = await userService.getUserById(req.params.id);
    return res.status(200).json({
      errCode: 0,
      message: "OK",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Error from server",
    });
  }
};

let handleResetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Token, new password and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "New password and confirm password do not match",
      });
    }

    let message = await userService.handleResetPassword(
      resetToken,
      newPassword
    );
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  handleLogin: handleLogin,
  handleCreateNewUser: handleCreateNewUser,
  handleDeleteUser: handleDeleteUser,
  handleEditUser: handleEditUser,
  handleGoogleLogin: handleGoogleLogin,
  handleLogout: handleLogout,
  handleForgotPassword: handleForgotPassword,
  handleResetPassword: handleResetPassword,
  handleGetProfile: handleGetProfile,
  handleUpdateProfile: handleUpdateProfile,
  handleGetAllUsers: handleGetAllUsers,
  handleGetUserById: handleGetUserById,
};
