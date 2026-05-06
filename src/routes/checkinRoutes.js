const express = require("express");
const { renderCheckinPage } = require("../controllers/checkinController");
const { requireAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/admin/check-in", requireAdmin, renderCheckinPage);

module.exports = router;
