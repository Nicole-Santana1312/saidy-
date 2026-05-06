const { body, param } = require("express-validator");

const eventIdValidator = [
  param("id")
    .isUUID()
    .withMessage("El id del evento debe ser valido."),
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
  body("hora")
    .notEmpty()
    .withMessage("La hora es obligatoria.")
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("La hora debe tener formato HH:mm."),
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
    .custom((value) => {
      const isRemoteUrl = /^https?:\/\/\S+$/i.test(value);
      const isDataImage = /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value);

      if (!isRemoteUrl && !isDataImage) {
        throw new Error("La imagen debe ser una URL valida o un archivo de imagen.");
      }

      return true;
    }),
  body("categoria")
    .isIn(["concierto", "stand_up", "actividad"])
    .withMessage("La categoria debe ser concierto, stand up o actividad."),
  body("estado")
    .optional()
    .isIn(["activo", "pausado", "finalizado"])
    .withMessage("El estado debe ser activo, pausado o finalizado."),
  body("ticket_types")
    .optional()
    .isArray()
    .withMessage("Los tipos de boletas deben enviarse como una lista."),
  body("ticket_types.*.tipo")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Cada tipo de boleta necesita un nombre.")
    .isLength({ max: 60 })
    .withMessage("El nombre del tipo de boleta no puede superar 60 caracteres."),
  body("ticket_types.*.precio")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Cada precio debe ser mayor o igual a cero."),
  body("ticket_types.*.cantidad_disponible")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Cada stock inicial debe ser mayor que cero."),
];

module.exports = {
  eventIdValidator,
  eventValidator,
};
