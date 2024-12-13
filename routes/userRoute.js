const router = require("express").Router();
const { getUser, verifyUser } = require("../controllers/userController");

router.get("/", getUser);
router.post("/verify", verifyUser);

module.exports = router;