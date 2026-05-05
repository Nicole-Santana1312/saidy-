const express = require("express");
const { renderLogin, login, logout } = require("../controllers/authController");
const { loginValidator } = require("../validators/authValidator");
const validateRequest = require("../middlewares/validateRequest");
const { limitLoginAttempts } = require("../middlewares/securityMiddleware");

const router = express.Router();

router.get("/login", renderLogin);
router.post("/login", limitLoginAttempts, loginValidator, validateRequest, login);
router.post("/auth/login", limitLoginAttempts, loginValidator, validateRequest, login);
router.get("/auth/login", (req, res) => {
  res.redirect(303, "/login");
});
router.post("/auth/logout", logout);

module.exports = router;
