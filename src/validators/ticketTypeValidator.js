const { body, param } = require("express-validator");

const allowedTypes = ["General", "VIP", "Preferencial"];

const ticketTypeIdValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id de la boleta debe ser un numero valido."),
];

const eventIdParamValidator = [
  param("eventoId")
    .isInt({ min: 1 })
    .withMessage("El id del evento debe ser un numero valido."),
];

const ticketTypeValidator = [
  body("evento_id")
    .isInt({ min: 1 })
    .withMessage("Debes seleccionar un evento valido."),
  body("tipo")
    .isIn(allowedTypes)
    .withMessage("El tipo debe ser General, VIP o Preferencial."),
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
