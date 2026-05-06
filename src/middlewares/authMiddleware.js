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

    if (!["admin", "super_admin"].includes(payload.role)) {
      return handleForbidden(req, res);
    }

    // Dejamos el usuario autenticado disponible para las rutas protegidas.
    req.admin = payload;
    return next();
  } catch (error) {
    return handleUnauthorized(req, res, "Sesion invalida o expirada.");
  }
}

function requireSuperAdmin(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return handleUnauthorized(req, res, "Debes iniciar sesion.");
  }

  try {
    const payload = verifyToken(token);

    if (payload.role !== "super_admin") {
      return handleForbidden(req, res);
    }

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

function extractUserToken(req) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return req.cookies.user_token;
}

function requireUser(req, res, next) {
  const token = extractUserToken(req);

  if (!token) {
    if (wantsHtml(req)) {
      return res.redirect(303, "/user/login");
    }
    return res.status(401).json({ message: "Debes iniciar sesion." });
  }

  try {
    const payload = verifyToken(token);

    if (payload.role !== "user") {
      if (wantsHtml(req)) {
        res.clearCookie("user_token");
        return res.redirect(303, "/user/login");
      }
      return res.status(403).json({ message: "Acceso denegado." });
    }

    // Hacemos disponible el usuario autenticado para las rutas protegidas.
    req.user = payload;
    return next();
  } catch (error) {
    if (wantsHtml(req)) {
      res.clearCookie("user_token");
      return res.redirect(303, "/user/login");
    }
    return res.status(401).json({ message: "Sesion invalida o expirada." });
  }
}

module.exports = {
  requireAdmin,
  requireSuperAdmin,
  requireUser,
};
