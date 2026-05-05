const { verifyToken } = require("../utils/jwt");
const { wantsHtml } = require("../utils/requestFormat");

function extractToken(req) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return req.cookies.admin_token;
}

function requireAdmin(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return handleUnauthorized(req, res, "Debes iniciar sesion.");
  }

  try {
    const payload = verifyToken(token);

    if (payload.role !== "admin") {
      return handleForbidden(req, res);
    }

    // Dejamos el usuario autenticado disponible para las rutas protegidas.
    req.admin = payload;
    return next();
  } catch (error) {
    return handleUnauthorized(req, res, "Sesion invalida o expirada.");
  }
}

function handleUnauthorized(req, res, message) {
  if (wantsHtml(req)) {
    return res.redirect(303, `/login?error=${encodeURIComponent(message)}`);
  }

  return res.status(401).json({ message });
}

function handleForbidden(req, res) {
  if (wantsHtml(req)) {
    return res.status(403).send("Acceso denegado: solo administradores.");
  }

  return res.status(403).json({
    message: "Acceso denegado: solo administradores.",
  });
}

module.exports = {
  requireAdmin,
};
