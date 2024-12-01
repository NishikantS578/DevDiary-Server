const router = require("express").Router();

const { getBlog, getBlogById, postBlog } = require("../controllers/blogController");

router.get("/", getBlog);
router.get("/:id", getBlogById);
router.post("/", postBlog);

module.exports = router;