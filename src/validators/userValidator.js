const { param, query } = require("express-validator");

const userSearchValidator = [
  query("q")
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage("La busqueda no puede superar 120 caracteres."),
];

const userIdValidator = [
  param("id")
    .isUUID()
    .withMessage("El id del usuario debe ser valido."),
];

module.exports = {
  userIdValidator,
  userSearchValidator,
};
