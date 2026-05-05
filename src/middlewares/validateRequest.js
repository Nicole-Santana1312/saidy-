const { validationResult } = require("express-validator");
const { wantsHtml } = require("../utils/requestFormat");

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const messages = errors.array().map((error) => error.msg);

  if (wantsHtml(req)) {
    return res.redirect(303, `/login?error=${encodeURIComponent(messages[0])}`);
  }

  return res.status(400).json({
    message: "Datos de entrada invalidos.",
    errors: messages,
  });
}

module.exports = validateRequest;
