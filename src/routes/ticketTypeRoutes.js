const express = require("express");
const ticketTypeController = require("../controllers/ticketTypeController");
const { requireAdmin } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  eventIdParamValidator,
  ticketTypeIdValidator,
  ticketTypeValidator,
} = require("../validators/ticketTypeValidator");

const router = express.Router();

router.get(
  "/admin/boletas",
  requireAdmin,
  ticketTypeController.renderTicketTypesPage
);

// API REST protegida para gestionar tipos de boletas relacionados con eventos.
router.get(
  "/api/eventos/:eventoId/boletas",
  requireAdmin,
  eventIdParamValidator,
  validateRequest,
  ticketTypeController.listTicketTypesByEvent
);
router.get(
  "/api/boletas/:id",
  requireAdmin,
  ticketTypeIdValidator,
  validateRequest,
  ticketTypeController.getTicketType
);
router.post(
  "/api/boletas",
  requireAdmin,
  ticketTypeValidator,
  validateRequest,
  ticketTypeController.createTicketType
);
router.put(
  "/api/boletas/:id",
  requireAdmin,
  ticketTypeIdValidator,
  ticketTypeValidator,
  validateRequest,
  ticketTypeController.updateTicketType
);
router.delete(
  "/api/boletas/:id",
  requireAdmin,
  ticketTypeIdValidator,
  validateRequest,
  ticketTypeController.deleteTicketType
);

module.exports = router;
