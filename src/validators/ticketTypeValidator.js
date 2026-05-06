const { body, param } = require("express-validator");

const ticketTypeIdValidator = [
  param("id")
    .isUUID()
    .withMessage("El id de la boleta debe ser valido."),
];

const eventIdParamValidator = [
  param("eventoId")
    .isUUID()
    .withMessage("El id del evento debe ser valido."),
];

const ticketTypeValidator = [
  body("evento_id")
    .isUUID()
    .withMessage("Debes seleccionar un evento valido."),
  body("tipo")
    .trim()
    .notEmpty()
    .withMessage("El nombre del tipo es obligatorio.")
    .isLength({ max: 60 })
    .withMessage("El nombre del tipo no puede superar 60 caracteres."),
  body("precio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un numero mayor o igual a cero."),
  body("cantidad_disponible")
    .isInt({ min: 0 })
    .withMessage("La cantidad disponible debe ser un entero mayor o igual a cero."),
];

module.exports = {
  eventIdParamValidator,
  ticketTypeIdValidator,
  ticketTypeValidator,
};
