const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    Author: {
        type: String,
    },
    BlogContent: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;