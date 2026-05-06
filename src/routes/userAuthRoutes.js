const express = require("express");
const {
  renderLoginPage,
  renderRegisterPage,
  renderVerificationPage,
  register,
  verifyAccount,
  login,
  logout,
} = require("../controllers/userAuthController");
const { registerValidator, loginUserValidator, verifyCodeValidator } = require("../validators/userAppValidator");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get("/user/login", renderLoginPage);
router.get("/user/register", renderRegisterPage);
router.get("/user/verify", renderVerificationPage);

router.post("/user/register", registerValidator, validateRequest, register);
router.post("/user/login", loginUserValidator, validateRequest, login);
router.post("/user/verify", verifyCodeValidator, validateRequest, verifyAccount);
router.post("/user/logout", logout);

module.exports = router;
