const { body, param } = require("express-validator");

const purchaseValidator = [
  body("tipo_boleta_id")
    .isUUID()
    .withMessage("Debes seleccionar un tipo de boleta valido."),
  body("cantidad")
    .isInt({ min: 1, max: 100 })
    .withMessage("La cantidad debe ser entre 1 y 100 boletas."),
];

const validateTicketValidator = [
  body("codigo_unico")
    .trim()
    .notEmpty()
    .withMessage("El codigo del boleto es obligatorio.")
    .isLength({ min: 8, max: 20 })
    .withMessage("El formato del codigo es invalido."),
];

module.exports = {
  purchaseValidator,
  validateTicketValidator,
};
