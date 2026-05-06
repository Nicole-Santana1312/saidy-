const { body } = require("express-validator");

const registerValidator = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio.")
    .isLength({ max: 120 })
    .withMessage("El nombre no puede superar 120 caracteres."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio.")
    .isEmail()
    .withMessage("El email debe ser valido."),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria.")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener minimo 6 caracteres."),
];

const loginUserValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio.")
    .isEmail()
    .withMessage("El email debe ser valido."),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria."),
];

const verifyCodeValidator = [
  body("verification_code")
    .trim()
    .notEmpty()
    .withMessage("El código de verificación es obligatorio.")
    .isLength({ min: 6, max: 6 })
    .withMessage("El código de verificación debe tener 6 dígitos."),
];

const updateProfileValidator = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio.")
    .isLength({ max: 120 })
    .withMessage("El nombre no puede superar 120 caracteres."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio.")
    .isEmail()
    .withMessage("El email debe ser valido."),
  body("telefono")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("El telefono no puede superar 20 caracteres."),
];

module.exports = {
  registerValidator,
  loginUserValidator,
  verifyCodeValidator,
  updateProfileValidator,
};
