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

function signUserToken(user) {
  // El payload para usuarios del sistema
  return jwt.sign(
    {
      sub: user.id,
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      role: "user",
    },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
}

function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

module.exports = {
  signAdminToken,
  signUserToken,
  verifyToken,
};
