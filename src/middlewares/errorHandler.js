const { wantsHtml } = require("../utils/requestFormat");

function notFound(req, res, next) {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const message =
    status === 500 ? "Error interno del servidor." : error.message;

  console.error(error);

  if (wantsHtml(req)) {
    return res
      .status(status)
      .send(`<h1>${status}</h1><p>${escapeHtml(message)}</p>`);
  }

  return res.status(status).json({ message });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = {
  notFound,
  errorHandler,
};
