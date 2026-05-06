const { body, param } = require("express-validator");

const purchaseValidator = [
  body("tipo_boleta_id")
    .isUUID()
    .withMessage("Debes seleccionar un tipo de boleta valido."),
  body("cantidad")
    .isInt({ min: 1, max: 100 })
    .withMessage("La cantidad debe ser entre 1 y 100 boletas."),
  body("payment_method")
    .isIn(["tarjeta"])
    .withMessage("Debes seleccionar un metodo de pago valido."),
  body("cardholder_name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre del titular de la tarjeta es obligatorio."),
  body("card_number")
    .customSanitizer((value) => String(value || "").replace(/\D/g, ""))
    .isLength({ min: 13, max: 19 })
    .withMessage("El numero de tarjeta debe tener entre 13 y 19 digitos."),
  body("card_expiry")
    .trim()
    .notEmpty()
    .withMessage("La fecha de expiracion es obligatoria."),
  body("card_cvv")
    .trim()
    .notEmpty()
    .withMessage("El codigo CVV es obligatorio.")
    .isLength({ min: 3, max: 4 })
    .withMessage("El codigo CVV debe tener 3 o 4 digitos."),
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

function isValidCardNumber(value) {
  let sum = 0;
  let shouldDouble = false;

  for (let index = value.length - 1; index >= 0; index--) {
    let digit = Number(value[index]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum > 0 && sum % 10 === 0;
}

function isExpiredCard(value) {
  const [month, year] = value.split("/").map(Number);
  const expiryDate = new Date(2000 + year, month, 0, 23, 59, 59);

  return expiryDate < new Date();
}
