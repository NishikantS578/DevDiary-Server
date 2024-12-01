const router = require("express").Router();
const blogRouter = require("../routes/blogRoute");

router.use("/posts", blogRouter);

module.exports = router;