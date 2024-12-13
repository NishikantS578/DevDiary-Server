const router = require("express").Router();
const blogRouter = require("../routes/blogRoute");
const authRouter = require("../routes/authRoute");
const userRouter = require("../routes/userRoute");

router.use("/posts", blogRouter);
router.use("/auth", authRouter);
router.use('/user', userRouter)

module.exports = router;