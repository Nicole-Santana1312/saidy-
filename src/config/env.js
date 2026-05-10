require("dotenv").config({ quiet: true });

function optionalEnv(name, fallback = "") {
  const value = process.env[name];

  if (!value || /^<.*>$/.test(value.trim()) || value.startsWith("tu_")) {
    return fallback;
  }

  return value;
}

const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "clave_temporal_solo_para_desarrollo",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  adminEmail: process.env.ADMIN_EMAIL || "admin@example.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin12345!",
  adminResetPasswordOnStart: process.env.ADMIN_RESET_PASSWORD_ON_START === "true",
  supabaseUrl: optionalEnv("SUPABASE_URL"),
  supabaseKey: optionalEnv("SUPABASE_ANON_KEY"),
  supabaseServiceKey: optionalEnv("SUPABASE_SERVICE_ROLE_KEY"),
  emailHost: process.env.EMAIL_HOST || "smtp.gmail.com",
  emailPort: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465,
  emailSecure: process.env.EMAIL_SECURE !== "false",
  emailUser: optionalEnv("EMAIL_USER"),
  emailPassword: optionalEnv("EMAIL_PASSWORD"),
  emailFrom: optionalEnv("EMAIL_FROM", optionalEnv("EMAIL_USER", "no-reply@eventix.com")),
};

module.exports = env;
