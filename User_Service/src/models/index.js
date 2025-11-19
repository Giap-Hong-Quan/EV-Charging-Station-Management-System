const { Sequelize } = require("sequelize");
const config = require("../config/config.js");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    port: dbConfig.port || 3306,
    timezone: "+07:00",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require("./users")(sequelize, Sequelize);
db.UserRole = require("./userRoles")(sequelize, Sequelize);
db.AuthSession = require("./authSessions")(sequelize, Sequelize);

// Define associations
db.UserRole.hasMany(db.User, {
  foreignKey: "role_id",
  as: "users",
});

db.User.belongsTo(db.UserRole, {
  foreignKey: "role_id",
  as: "role",
});

db.User.hasMany(db.AuthSession, {
  foreignKey: "user_id",
  as: "sessions",
});

db.AuthSession.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "user",
});

module.exports = db;
