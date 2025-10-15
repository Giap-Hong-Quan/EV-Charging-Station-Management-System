// File: services/userService.js
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
          attributes: ["id", "email", "password", "fullName", "address"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            // Lấy role từ bảng UserRole
            const userRole = await db.UserRole.findOne({
              where: { user_id: user.id },
              order: [["created_at", "DESC"]],
            });

            const role = userRole ? userRole.role : "driver";

            const token = jwt.sign(
              { id: user.id, email: user.email, role: role },
              JWT_SECRET,
              { expiresIn: "1d" }
            );
            userData.errCode = 0;
            userData.errMessage = `OK`;
            delete user.password;
            userData.user = user;
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

        // Tạo user mới
        const newUser = await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          fullName: data.fullName,
          address: data.address,
          socialProvider: data.socialProvider,
          socialProviderId: data.socialProviderId,
        });

        // Tạo role cho user
        await db.UserRole.create({
          user_id: newUser.id,
          role: data.role || "driver",
          permissions: data.permissions || {},
        });

        resolve({
          errCode: 0,
          message: "OK",
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

      // Xóa các bản ghi liên quan
      await db.UserRole.destroy({
        where: { user_id: userId },
      });

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
        user.fullName = data.fullName;
        user.address = data.address;
        if (data.email) user.email = data.email;
        await user.save();

        // Update role nếu có
        if (data.role) {
          await db.UserRole.update(
            { role: data.role, permissions: data.permissions || {} },
            {
              where: { user_id: data.id },
              returning: true,
            }
          );
        }

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
let handleGoogleLogin = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { token, email, name } = data;

      console.log("=== GOOGLE LOGIN DEBUG ===");
      console.log("Token received:", token ? "YES" : "NO");
      console.log("Token length:", token ? token.length : 0);
      console.log("Client ID from env:", process.env.GOOGLE_CLIENT_ID);

      let payload;

      if (token && token.startsWith("eyJ")) {
        console.log(
          "DEVELOPMENT: Bypassing Google verification for real token"
        );
        try {
          const decoded = jwt.decode(token);
          payload = {
            email: decoded.email || email || `user_${Date.now()}@gmail.com`,
            name: decoded.name || name || "Google User",
            sub: decoded.sub || `google_id_${Date.now()}`,
            picture: decoded.picture || "",
          };
          console.log(" Decoded email:", payload.email);
          console.log(" Decoded name:", payload.name);
        } catch (decodeError) {
          console.log(" Token decode failed, using fallback");
          payload = {
            email: email || `fallback_${Date.now()}@gmail.com`,
            name: name || "Fallback User",
            sub: `fallback_${Date.now()}`,
            picture: "",
          };
        }
      } else {
        console.log("DEVELOPMENT: Using mock token");
        payload = {
          email: email || `mock_${Date.now()}@gmail.com`,
          name: name || "Mock User",
          sub: `mock_${Date.now()}`,
          picture: "",
        };
      }

      console.log(" Final payload:", payload);

      // Kiểm tra user tồn tại
      let user = await db.User.findOne({
        where: { email: payload.email },
      });

      let isNewUser = false;

      if (!user) {
        // Tạo user mới
        isNewUser = true;
        user = await db.User.create({
          email: payload.email,
          fullName: payload.name,
          socialProvider: "google",
          socialProviderId: payload.sub,
          password: "",
        });

        // Tạo default role
        await db.UserRole.create({
          user_id: user.id,
          role: "driver",
          permissions: null,
        });

        console.log(" New user created:", user.id);
      } else {
        console.log(" Existing user found:", user.id);
      }

      // Tạo JWT token
      const jwtToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: "driver",
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

      resolve({
        errCode: 0,
        message: isNewUser
          ? "Google registration successful"
          : "Google login successful",
        token: jwtToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: "driver",
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

      // Tạo reset token
      const resetToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Gửi vể email
      // await sendResetEmail(user.email, resetToken);

      // Lưu reset token vào database
      console.log(`Reset token for ${user.email}: ${resetToken}`);

      resolve({
        errCode: 0,
        message: "Reset password email sent",
        resetToken: resetToken,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let handleResetPassword = (token, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra độ dài mật khẩu
      if (!newPassword || newPassword.length < 6) {
        resolve({
          errCode: 1,
          message: "Password must be at least 6 characters long",
        });
        return;
      }

      // Xác minh token đặt lại
      const decoded = jwt.verify(token, JWT_SECRET);

      let user = await db.User.findOne({
        where: { id: decoded.id, email: decoded.email },
      });

      if (!user) {
        resolve({
          errCode: 2,
          message: "Invalid or expired reset token",
        });
        return;
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await hashUserPassword(newPassword);

      // Cập nhật mật khẩu
      user.password = hashedPassword;
      await user.save();

      // Xóa tất cả sessions cũ để bảo mật
      await db.AuthSession.destroy({
        where: { user_id: user.id },
      });

      resolve({
        errCode: 0,
        message: "Password reset successful",
      });
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        resolve({
          errCode: 3,
          message: "Reset token has expired",
        });
      } else if (e.name === "JsonWebTokenError") {
        resolve({
          errCode: 4,
          message: "Invalid reset token",
        });
      } else {
        reject(e);
      }
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
            as: "roles",
            attributes: ["role", "permissions"],
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
            as: "roles",
            attributes: ["role", "permissions"],
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
            as: "roles",
            attributes: ["role", "permissions"],
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
