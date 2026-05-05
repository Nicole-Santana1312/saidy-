const { body } = require("express-validator");

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio.")
    .isEmail()
    .withMessage("Ingresa un email valido.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("La contrasena es obligatoria.")
    .isLength({ min: 8 })
    .withMessage("La contrasena debe tener al menos 8 caracteres."),
];

module.exports = {
  loginValidator,
};
