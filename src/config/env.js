require("dotenv").config({ quiet: true });

const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "clave_temporal_solo_para_desarrollo",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  adminEmail: process.env.ADMIN_EMAIL || "admin@example.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin12345!",
};

module.exports = env;
