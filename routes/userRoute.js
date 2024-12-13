const router = require("express").Router();
const { getUser, verifyUser, sendPasswordResetOtp, updatePassword } = require("../controllers/userController");

router.get("/", getUser);
router.post("/verify", verifyUser);
router.post("/send-password-reset-otp", sendPasswordResetOtp)
router.post("/reset-password", updatePassword)

module.exports = router;