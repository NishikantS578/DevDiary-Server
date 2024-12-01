const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    BlogContent: {
        type: String,
        required: true,
    }
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;