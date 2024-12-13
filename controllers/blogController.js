const Blog = require("../models/BlogModel")

async function getBlog(req, res, next) {
    try {
        const data = await Blog.find();
        const resData = data.map((blog) => { return { id: blog._id, title: blog.Title, author: blog.Author, blogContent: blog.BlogContent } });
        res.status(200).json({ success: true, msg: "Successfully retrieved blogs.", data: resData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Error while retrieving blogs." });
    }
}

async function getBlogById(req, res, next) {
    try {
        const { id } = req.params;

        const data = await Blog.findById(id);

        res.status(200).json({ success: true, msg: "Successfully retrieved blog.", data: { id: data._id, title: data.Title, author: data.Author, blogContent: data.BlogContent } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Error while retrieving blog." });
    }
}

async function postBlog(req, res, next) {
    try {
        const { title, blogContent, author } = req.body;

        const data = await Blog.create({ Title: title, Author: author, BlogContent: blogContent });

        res.status(201).json({ success: true, msg: "Successfully created blog.", data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Error while creating blog." });
    }
}

module.exports = { getBlog, getBlogById, postBlog };