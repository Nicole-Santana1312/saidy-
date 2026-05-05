const express = require("express");
const { dashboard } = require("../controllers/adminController");
const { requireAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Todas las rutas definidas aqui requieren un JWT valido con rol admin.
router.get("/admin/dashboard", requireAdmin, dashboard);

module.exports = router;
