const { login, register, logout, sendOtp } = require("../controllers/authController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.get("/send-otp", sendOtp);

module.exports = router;