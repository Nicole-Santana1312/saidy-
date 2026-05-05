const express = require("express");
const reportController = require("../controllers/reportController");
const { requireAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/admin/reportes", requireAdmin, reportController.renderReportsPage);

// API REST protegida para reportes administrativos.
router.get("/api/reportes", requireAdmin, reportController.getReports);

module.exports = router;
