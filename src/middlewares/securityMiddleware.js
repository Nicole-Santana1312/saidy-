const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Demasiados intentos de inicio de sesion. Intenta de nuevo en 15 minutos.",
  },
});

function clearLoginAttempts(req, res, next) {
  // express-rate-limit reinicia automaticamente por ventana; este middleware
  // queda como punto de extension si luego se usa un store externo.
  return next ? next() : undefined;
}

module.exports = {
  clearLoginAttempts,
  limitLoginAttempts: loginLimiter,
};
