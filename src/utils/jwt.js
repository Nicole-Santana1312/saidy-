const jwt = require("jsonwebtoken");
const env = require("../config/env");

function signAdminToken(admin) {
  // El payload incluye solo datos necesarios; nunca se firma la contrasena.
  return jwt.sign(
    {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

module.exports = {
  signAdminToken,
  verifyToken,
};
