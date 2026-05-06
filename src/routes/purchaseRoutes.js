const express = require("express");
const {
  makePurchase,
  checkInTicket,
  getTicketInfo,
} = require("../controllers/purchaseController");
const { requireUser } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const { purchaseValidator, validateTicketValidator } = require("../validators/purchaseValidator");

const router = express.Router();

// Rutas protegidas - requieren autenticación de usuario
router.post(
  "/api/user/compras",
  requireUser,
  purchaseValidator,
  validateRequest,
  makePurchase
);

// Check-in de boletos (puede ser públicos o protegidos según requerimiento)
router.post(
  "/api/check-in",
  validateTicketValidator,
  validateRequest,
  checkInTicket
);

router.get("/api/boletos/:codigo_unico", getTicketInfo);

module.exports = router;
