const express = require("express");
const eventController = require("../controllers/eventController");
const { requireAdmin } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  eventIdValidator,
  eventValidator,
} = require("../validators/eventValidator");

const router = express.Router();

router.get("/admin/eventos", requireAdmin, eventController.renderEventsPage);

// API REST protegida para administrar eventos.
router.get("/api/eventos", requireAdmin, eventController.listEvents);
router.get(
  "/api/eventos/:id",
  requireAdmin,
  eventIdValidator,
  validateRequest,
  eventController.getEvent
);
router.post(
  "/api/eventos",
  requireAdmin,
  eventValidator,
  validateRequest,
  eventController.createEvent
);
router.put(
  "/api/eventos/:id",
  requireAdmin,
  eventIdValidator,
  eventValidator,
  validateRequest,
  eventController.updateEvent
);
router.delete(
  "/api/eventos/:id",
  requireAdmin,
  eventIdValidator,
  validateRequest,
  eventController.deleteEvent
);

module.exports = router;
