import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index";
import { Op } from "sequelize";

const salt = bcrypt.genSaltSync(10);
const JWT_SECRET = process.env.JWT_SECRET;

// Mã hóa password
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

// Kiểm tra email
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Tạo mật khẩu ngẫu nhiên
let generateRandomPassword = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Xử lý login
let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: [
            "id",
            "email",
            "password",
            "full_name",
            "address",
            "role_id",
          ],
          where: { email: email },
          include: [
            {
              model: db.UserRole,
              as: "role",
              attributes: ["role_name", "permissions"],
            },
          ],
          raw: false,
        });

        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            const role = user.role ? user.role.role_name : "driver";

            const token = jwt.sign(
              {
                id: user.id,
                email: user.email,
                role: role,
                role_id: user.role_id,
              },
              JWT_SECRET,
              { expiresIn: "1d" }
            );

            userData.errCode = 0;
            userData.errMessage = `OK`;
            delete user.password;
            userData.user = {
              id: user.id,
              email: user.email,
              fullName: user.full_name,
              address: user.address,
              role: role,
              role_id: user.role_id,
              permissions: user.role ? user.role.permissions : {},
            };
            userData.token = token;

            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
            await db.AuthSession.create({
              token,
              user_id: user.id,
              expires_at: expiresAt,
            });
          } else {
            userData.errCode = 3;
            userData.errMessage = `Wrong password`;
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Your's email isn't exist in your system. Plz try other email.`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

// Xử lý đăng ký
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "your email is already in used, plz try another email!",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);

        let roleId = 3;

        if (data.role_id) {
          roleId = data.role_id;
        } else if (data.role) {
          const roleMap = {
            admin: 1,
            staff: 2,
            driver: 3,
          };
          roleId = roleMap[data.role] || 3;
        }

        console.log("Creating user with role_id:", roleId); // Debug

        // Tạo user mới
        const newUser = await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          full_name: data.fullName,
          address: data.address,
          role_id: roleId,
          social_provider: data.socialProvider,
          social_provider_id: data.socialProviderId,
        });

        resolve({
          errCode: 0,
          message: "OK",
          user: newUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Xử lý xóa user
let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: `The user isn't exist`,
        });
      }

      // CHỈ xóa auth sessions
      await db.AuthSession.destroy({
        where: { user_id: userId },
      });

      await db.User.destroy({
        where: { id: userId },
      });

      resolve({
        errCode: 0,
        errMessage: `The user is deleted`,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xử lý cập nhật user
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.full_name = data.fullName;
        user.address = data.address;

        await user.save();

        resolve({
          errCode: 0,
          message: `Update the user succeeds!`,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: `User's not found`,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Xử lý login google
let handleGoogleLogin = (googleToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("=== GOOGLE LOGIN DEBUG ===");
      console.log("Token received:", googleToken ? "YES" : "NO");
      console.log("Token length:", googleToken ? googleToken.length : 0);

      let payload;

      if (googleToken && googleToken.startsWith("eyJ")) {
        console.log(
          "DEVELOPMENT: Bypassing Google verification for real token"
        );
        try {
          const decoded = jwt.decode(googleToken);
          payload = {
            email: decoded.email || `user_${Date.now()}@gmail.com`,
            name: decoded.name || "Google User",
            sub: decoded.sub || `google_id_${Date.now()}`,
            picture: decoded.picture || "",
          };
          console.log(" Decoded email:", payload.email);
          console.log(" Decoded name:", payload.name);
        } catch (decodeError) {
          console.log(" Token decode failed, using fallback");
          payload = {
            email: `fallback_${Date.now()}@gmail.com`,
            name: "Fallback User",
            sub: `fallback_${Date.now()}`,
            picture: "",
          };
        }
      } else {
        console.log("DEVELOPMENT: Using mock token");
        payload = {
          email: `mock_${Date.now()}@gmail.com`,
          name: "Mock User",
          sub: `mock_${Date.now()}`,
          picture: "",
        };
      }

      console.log(" Final payload:", payload);

      // Kiểm tra user tồn tại
      let user = await db.User.findOne({
        where: { email: payload.email },
        include: [
          {
            model: db.UserRole,
            as: "role",
            attributes: ["id", "role_name", "permissions"],
          },
        ],
      });

      let isNewUser = false;

      if (!user) {
        // Tạo user mới với role mặc định là driver (role_id = 3)
        isNewUser = true;
        user = await db.User.create({
          email: payload.email,
          full_name: payload.name,
          social_provider: "google",
          social_provider_id: payload.sub,
          password: "",
          role_id: 3, // Default role: driver
        });

        // Load thông tin role sau khi tạo user
        user = await db.User.findOne({
          where: { id: user.id },
          include: [
            {
              model: db.UserRole,
              as: "role",
              attributes: ["id", "role_name", "permissions"],
            },
          ],
        });

        console.log(
          " New user created:",
          user.id,
          "with role_id:",
          user.role_id
        );
      } else {
        console.log(
          " Existing user found:",
          user.id,
          "with role_id:",
          user.role_id
        );
      }

      // Lấy thông tin role name từ relationship
      const roleName = user.role ? user.role.role_name : "driver";
      const roleId = user.role_id || 3;
      const permissions = user.role ? user.role.permissions : {};

      // Tạo JWT token cho hệ thống
      const jwtToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: roleName,
          role_id: roleId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Tạo auth session
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await db.AuthSession.create({
        token: jwtToken,
        user_id: user.id,
        expires_at: expiresAt,
      });

      console.log(" Google OAuth successful for user:", user.email);
      console.log(" User role:", roleName, "Role ID:", roleId);

      resolve({
        errCode: 0,
        message: isNewUser
          ? "Google registration successful"
          : "Google login successful",
        token: jwtToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name, // Map full_name -> fullName trong response
          role: roleName,
          role_id: roleId,
          permissions: permissions,
          isNewUser: isNewUser,
        },
      });
    } catch (e) {
      console.error(" Google login error:", e);
      reject(e);
    }
  });
};

// Xử lý logout
let handleLogout = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!token) {
        resolve({
          errCode: 1,
          message: "Token is required",
        });
        return;
      }

      const result = await db.AuthSession.destroy({
        where: { token: token },
      });

      if (result === 0) {
        resolve({
          errCode: 2,
          message: "Token not found or already logged out",
        });
      } else {
        resolve({
          errCode: 0,
          message: "Logout successful",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Xử lý quên mật khẩu
let handleForgotPassword = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: email },
      });

      if (!user) {
        resolve({
          errCode: 1,
          message: "Email not found",
        });
        return;
      }

      // Tạo mật khẩu tạm thời 8 ký tự
      const temporaryPassword = generateRandomPassword(8);

      // Mã hóa mật khẩu tạm thời
      const hashedPassword = await hashUserPassword(temporaryPassword);

      // Cập nhật mật khẩu tạm thời trong database
      user.password = hashedPassword;
      await user.save();

      //Gửi email chứa mật khẩu tạm thời
      // await sendTemporaryPasswordEmail(user.email, temporaryPassword);

      console.log(`Temporary password for ${user.email}: ${temporaryPassword}`);
      console.log(
        `Please implement sendTemporaryPasswordEmail function to send this password to user`
      );

      // Xóa tất cả sessions cũ để bảo mật
      await db.AuthSession.destroy({
        where: { user_id: user.id },
      });

      resolve({
        errCode: 0,
        message:
          "Temporary password has been sent to your email. Please login and change your password.",

        newPassword: temporaryPassword,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let handleResetPassword = (userId, currentPassword, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra độ dài mật khẩu mới
      if (!newPassword || newPassword.length < 6) {
        resolve({
          errCode: 1,
          message: "New password must be at least 6 characters long",
        });
        return;
      }

      let user = await db.User.findOne({
        where: { id: userId },
      });

      if (!user) {
        resolve({
          errCode: 2,
          message: "User not found",
        });
        return;
      }

      // Kiểm tra mật khẩu hiện tại
      if (currentPassword) {
        const isCurrentPasswordValid = await bcrypt.compareSync(
          currentPassword,
          user.password
        );
        if (!isCurrentPasswordValid) {
          resolve({
            errCode: 3,
            message: "Current password is incorrect",
          });
          return;
        }
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await hashUserPassword(newPassword);

      // Cập nhật mật khẩu mới
      user.password = hashedPassword;
      await user.save();

      // Xóa tất cả sessions cũ để bảo mật (trừ session hiện tại nếu cần)
      await db.AuthSession.destroy({
        where: { user_id: user.id },
      });

      resolve({
        errCode: 0,
        message: "Password reset successful",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xử lý lấy thông tin profile
let getUserProfile = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        attributes: { exclude: ["password"] },
        where: { id: userId },
        include: [
          {
            model: db.UserRole,
            as: "role",
            attributes: ["role_name", "permissions"],
          },
        ],
      });

      if (!user) {
        resolve(null);
      } else {
        resolve(user);
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Xử lý lấy thông tin tất cả user
let getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.UserRole,
            as: "role",
            attributes: ["role_name", "permissions"],
          },
        ],
        order: [["created_at", "DESC"]],
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

// Xử lý lấy thông tin user theo id
let getUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        attributes: { exclude: ["password"] },
        where: { id: userId },
        include: [
          {
            model: db.UserRole,
            as: "role",
            attributes: ["role_name", "permissions"],
          },
        ],
      });

      if (!user) {
        resolve(null);
      } else {
        resolve(user);
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  handleGoogleLogin: handleGoogleLogin,
  handleLogout: handleLogout,
  handleForgotPassword: handleForgotPassword,
  handleResetPassword: handleResetPassword,
  getUserProfile: getUserProfile,
  getAllUsers: getAllUsers,
  getUserById: getUserById,
  checkUserEmail: checkUserEmail,
  hashUserPassword: hashUserPassword,
};
