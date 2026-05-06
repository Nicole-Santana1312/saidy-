const express = require("express");
const { dashboard } = require("../controllers/adminController");
const adminManagementController = require("../controllers/adminManagementController");
const { requireAdmin, requireSuperAdmin } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const { adminIdValidator, adminValidator } = require("../validators/adminValidator");

const router = express.Router();

// Todas las rutas definidas aqui requieren un JWT valido con rol admin.
router.get("/admin/dashboard", requireAdmin, dashboard);
router.get("/admin/admins", requireSuperAdmin, adminManagementController.renderAdminsPage);
router.get("/api/admins", requireSuperAdmin, adminManagementController.getAdmins);
router.post(
  "/api/admins",
  requireSuperAdmin,
  adminValidator,
  validateRequest,
  adminManagementController.storeAdmin
);
router.delete(
  "/api/admins/:id",
  requireSuperAdmin,
  adminIdValidator,
  validateRequest,
  adminManagementController.removeAdmin
);

module.exports = router;
