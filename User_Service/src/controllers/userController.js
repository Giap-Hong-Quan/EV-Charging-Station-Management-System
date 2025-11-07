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

// let handleCreateNewUser = async (req, res) => {
//   let message = await userService.createNewUser(req.body);
//   return res.status(200).json(message);
// };

let handleCreateNewUser = async (req, res) => {
  try {
    // nếu có file được upload => Cloudinary trả về URL
    const avatarUrl = req.file ? req.file.path : null;

    const message = await userService.createNewUser({
      ...req.body,
      avatar: avatarUrl, // 👈 truyền thêm avatar
    });

    return res.status(200).json(message);
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Error from server",
    });
  }
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
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Google token is required",
      });
    }

    let message = await userService.handleGoogleLogin(token);
    return res.status(200).json(message);
  } catch (error) {
    console.error("Google login controller error:", error);
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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Email is required",
      });
    }

    let message = await userService.handleForgotPassword(email);
    return res.status(200).json(message);
  } catch (error) {
    console.error("Forgot password error:", error);
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

// let handleUpdateProfile = async (req, res) => {
//   try {
//     let data = req.body;
//     data.id = req.user.id;

//     // Validate: chỉ cho phép fullName và address
//     const allowedFields = ["fullName", "address", "avatar"];
//     const receivedFields = Object.keys(data);

//     // Kiểm tra nếu có field không được phép
//     const invalidFields = receivedFields.filter(
//       (field) => !allowedFields.includes(field) && field !== "id"
//     );

//     if (invalidFields.length > 0) {
//       return res.status(400).json({
//         errCode: 1,
//         errMessage: `Only fullName and address can be updated. Invalid fields: ${invalidFields.join(
//           ", "
//         )}`,
//       });
//     }

//     // Kiểm tra required fields
//     if (!data.fullName && !data.address) {
//       return res.status(400).json({
//         errCode: 1,
//         errMessage:
//           "At least one field (fullName or address) is required to update",
//       });
//     }

//     let message = await userService.updateUserData(data);
//     return res.status(200).json(message);
//   } catch (error) {
//     console.error("Update profile error:", error);
//     return res.status(500).json({
//       errCode: 1,
//       errMessage: "Error from server",
//     });
//   }
// };

let handleUpdateProfile = async (req, res) => {
  try {
    let data = req.body;
    data.id = req.user.id;
    const file = req.file;

    // Cho phép fullName, address, avatar
    const allowedFields = ["fullName", "address", "avatar"];
    const receivedFields = Object.keys(data);

    const invalidFields = receivedFields.filter(
      (field) => !allowedFields.includes(field) && field !== "id"
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        errCode: 1,
        errMessage: `Only fullName, address, and avatar can be updated. Invalid fields: ${invalidFields.join(
          ", "
        )}`,
      });
    }

    // Kiểm tra ít nhất có một field được gửi
    if (!data.fullName && !data.address && !file) {
      return res.status(400).json({
        errCode: 1,
        errMessage:
          "At least one field (fullName, address, or avatar) is required to update",
      });
    }

    // Gửi cả file xuống service
    let result = await userService.updateUserData(data, file);

    return res.status(200).json({
      errCode: result.errCode,
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
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
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id; // Lấy từ token

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "New password and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "New password and confirm password do not match",
      });
    }

    let message = await userService.handleResetPassword(
      userId,
      currentPassword, // Có thể null nếu reset từ forgot password
      newPassword
    );
    return res.status(200).json(message);
  } catch (error) {
    console.error("Reset password error:", error);
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
