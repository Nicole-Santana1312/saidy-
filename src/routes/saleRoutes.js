const express = require("express");
const saleController = require("../controllers/saleController");
const { requireAdmin } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  saleFilterValidator,
  saleValidator,
} = require("../validators/saleValidator");

const router = express.Router();

router.get("/admin/ventas", requireAdmin, saleController.renderSalesPage);

// API REST protegida para visualizar ventas y registrar compras de prueba.
router.get(
  "/api/ventas",
  requireAdmin,
  saleFilterValidator,
  validateRequest,
  saleController.listSales
);
router.post(
  "/api/ventas",
  requireAdmin,
  saleValidator,
  validateRequest,
  saleController.createSale
);

module.exports = router;
