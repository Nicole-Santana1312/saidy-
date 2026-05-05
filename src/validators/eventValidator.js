const { body, param } = require("express-validator");

const eventIdValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id del evento debe ser un numero valido."),
];

const eventValidator = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio.")
    .isLength({ max: 120 })
    .withMessage("El nombre no puede superar 120 caracteres."),
  body("fecha")
    .notEmpty()
    .withMessage("La fecha es obligatoria.")
    .isISO8601()
    .withMessage("La fecha debe tener un formato valido."),
  body("lugar")
    .trim()
    .notEmpty()
    .withMessage("El lugar es obligatorio.")
    .isLength({ max: 160 })
    .withMessage("El lugar no puede superar 160 caracteres."),
  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("La descripcion es obligatoria.")
    .isLength({ max: 1000 })
    .withMessage("La descripcion no puede superar 1000 caracteres."),
  body("imagen")
    .trim()
    .notEmpty()
    .withMessage("La imagen es obligatoria.")
    .isURL({ require_protocol: true })
    .withMessage("La imagen debe ser una URL valida con http o https."),
];

module.exports = {
  eventIdValidator,
  eventValidator,
};
