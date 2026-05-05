const express = require("express");
const userController = require("../controllers/userController");
const { requireAdmin } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  userIdValidator,
  userSearchValidator,
} = require("../validators/userValidator");

const router = express.Router();

router.get("/admin/usuarios", requireAdmin, userController.renderUsersPage);

// API REST protegida para consultar y administrar usuarios registrados.
router.get(
  "/api/usuarios",
  requireAdmin,
  userSearchValidator,
  validateRequest,
  userController.listUsers
);
router.get(
  "/api/usuarios/:id",
  requireAdmin,
  userIdValidator,
  validateRequest,
  userController.getUser
);
router.delete(
  "/api/usuarios/:id",
  requireAdmin,
  userIdValidator,
  validateRequest,
  userController.deleteUser
);

module.exports = router;
