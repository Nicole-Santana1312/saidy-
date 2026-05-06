const { body, param } = require("express-validator");

const adminIdValidator = [
  param("id").isUUID().withMessage("El id del administrador debe ser valido."),
];

const adminValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Debes escribir un correo valido.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contrasena debe tener al menos 8 caracteres."),
  body("role")
    .optional()
    .isIn(["admin", "super_admin"])
    .withMessage("El rol debe ser admin o super_admin."),
];

module.exports = {
  adminIdValidator,
  adminValidator,
};
