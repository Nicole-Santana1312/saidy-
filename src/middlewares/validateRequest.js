const { validationResult } = require("express-validator");
const { wantsHtml } = require("../utils/requestFormat");

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const messages = errors.array().map((error) => error.msg);

  if (wantsHtml(req)) {
    const redirectPath = req.originalUrl.split("?")[0] || req.url;
    return res.redirect(303, `${redirectPath}?error=${encodeURIComponent(messages[0])}`);
  }

  return res.status(400).json({
    message: messages[0] || "Datos de entrada invalidos.",
    errors: messages,
  });
}

module.exports = validateRequest;
