const { body, query } = require("express-validator");

const saleFilterValidator = [
  query("evento_id")
    .optional()
    .isUUID()
    .withMessage("El filtro de evento debe ser valido."),
];

const saleValidator = [
  body("usuario")
    .trim()
    .notEmpty()
    .withMessage("El usuario es obligatorio.")
    .isLength({ max: 120 })
    .withMessage("El usuario no puede superar 120 caracteres."),
  body("tipo_boleta_id")
    .isUUID()
    .withMessage("Debes seleccionar un tipo de boleta valido."),
  body("cantidad")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un entero mayor que cero."),
];

module.exports = {
  saleFilterValidator,
  saleValidator,
};
