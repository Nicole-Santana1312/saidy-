const express = require("express");
const {
  renderDashboard,
  renderEventsPage,
  renderEventDetailPage,
  renderTicketsPage,
  renderProfilePage,
  getPublicEvents,
  getPublicEvent,
  getEventTicketTypes,
  getUserPurchases,
  getUserTickets,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userDashboardController");
const { requireUser } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const { eventIdParamValidator } = require("../validators/ticketTypeValidator");
const { updateProfileValidator } = require("../validators/userAppValidator");

const router = express.Router();

// Rutas protegidas - requieren autenticación de usuario
router.get("/user/dashboard", requireUser, renderDashboard);
router.get("/user/eventos", requireUser, renderEventsPage);
router.get(
  "/user/eventos/:eventoId",
  requireUser,
  eventIdParamValidator,
  validateRequest,
  renderEventDetailPage
);
router.get("/user/boletos", requireUser, renderTicketsPage);
router.get("/user/perfil", requireUser, renderProfilePage);

// APIs para usuario autenticado
router.get("/api/user/perfil", requireUser, getUserProfile);
router.put("/api/user/perfil", requireUser, updateProfileValidator, validateRequest, updateUserProfile);
router.get("/api/user/compras", requireUser, getUserPurchases);
router.get("/api/user/boletos", requireUser, getUserTickets);

// API pública para eventos
router.get("/api/eventos-publicos", getPublicEvents);
router.get(
  "/api/eventos-publicos/:eventoId",
  eventIdParamValidator,
  validateRequest,
  getPublicEvent
);
router.get(
  "/api/eventos-publicos/:eventoId/tipos-boletas",
  eventIdParamValidator,
  validateRequest,
  getEventTicketTypes
);

module.exports = router;
