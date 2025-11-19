const express = require("express");
const bodyParser = require("body-parser");
const initWebRoutes = require("./route/web");
const db = require("./models");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// CORS middleware
app.use(
  cors({
    origin: process.env.URL_REACT || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["X-Requested-With", "content-type", "Authorization"],
    credentials: true,
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: "Connected",
    environment: process.env.NODE_ENV || "development",
  });
});

// Hàm seed user roles
const seedUserRoles = async () => {
  try {
    console.log("🔹 Seeding user roles...");

    const roles = [
      {
        id: 1,
        role_name: "admin",
        description: "Quản trị viên hệ thống",
        permissions: {
          can_manage_users: true,
          can_manage_stations: true,
          can_view_reports: true,
          can_manage_roles: true,
        },
      },
      {
        id: 2,
        role_name: "staff",
        description: "Nhân viên",
        permissions: {
          can_manage_stations: true,
          can_view_reports: true,
          can_manage_orders: true,
        },
      },
      {
        id: 3,
        role_name: "driver",
        description: "Tài xế",
        permissions: {
          can_view_orders: true,
          can_update_status: true,
          can_view_assigned_orders: true,
        },
      },
    ];

    for (const roleData of roles) {
      const [role, created] = await db.UserRole.findOrCreate({
        where: { id: roleData.id },
        defaults: roleData,
      });

      if (created) {
        console.log(`✅ Created role: ${roleData.role_name}`);
      } else {
        console.log(`ℹ️ Role already exists: ${roleData.role_name}`);
      }
    }

    console.log("✅ User roles seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding user roles:", error);
    throw error;
  }
};

// Kết nối database và seed data
const connectDB = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    const syncOptions =
      process.env.NODE_ENV === "production" ? { alter: false } : { alter: true };

    await db.sequelize.sync(syncOptions);
    console.log("✅ Database synced successfully.");

    await seedUserRoles();
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
};

// Khởi tạo routes
app.use("/api/v1", initWebRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error stack:", err.stack);
  res.status(500).json({
    errCode: 1,
    errMessage: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    errCode: 1,
    errMessage: "Endpoint not found",
    path: req.path,
    method: req.method,
  });
});

const port = process.env.PORT || 8082;

// Khởi động máy chủ với database connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`🌱 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? "Set" : "Not set"}`);
      console.log(
        `🌐 Frontend URL: ${process.env.URL_REACT || "http://localhost:3000"}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Khởi động server
startServer();

module.exports = app;
