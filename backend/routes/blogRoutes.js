const express = require("express");
const Blog = require("../models/blog.js");
const slugify = require("slugify");

const router = express.Router();

// Create a blog post
router.post("/", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const slug = slugify(title, { lower: true, strict: true });

    // Check if slug exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({ error: "A blog with this title already exists" });
    }

    const blog = new Blog({ title, slug, content, author });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to create blog post" });
  }
});

// Get all blog posts
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

// Get a single blog post
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

// Count the number of blog posts
router.get("/count", async (req, res) => {
  try {
    const blogCount = await Blog.countDocuments();
    console.log("Blog Count:", blogCount); // Log the count for debugging
    res.status(200).json({ blogCount });
  } catch (error) {
    console.error("Error counting blogs:", error); // Log the error
    res.status(500).json({ error: "Failed to count blog posts" });
  }
});




// Update a blog post
router.put("/:id", async (req, res) => {
  try {
    const { title, content, author } = req.body;

    let blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (title !== blog.title) {
      const newSlug = slugify(title, { lower: true, strict: true });

      const existingBlog = await Blog.findOne({ slug: newSlug });
      if (existingBlog && existingBlog._id.toString() !== req.params.id) {
        return res.status(400).json({ error: "A blog with this title already exists" });
      }

      blog.slug = newSlug;
    }

    blog.title = title;
    blog.content = content;
    blog.author = author;

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

// Delete a blog post
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

// Update a blog post (edit route)
router.put("/:id", async (req, res) => {
    try {
      const { title, content, author } = req.body;
  
      if (!title || !content || !author) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      let blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ error: "Blog not found" });
  
      if (title !== blog.title) {
        const newSlug = slugify(title, { lower: true, strict: true });
  
        const existingBlog = await Blog.findOne({ slug: newSlug });
        if (existingBlog && existingBlog._id.toString() !== req.params.id) {
          return res.status(400).json({ error: "A blog with this title already exists" });
        }
  
        blog.slug = newSlug;
      }
  
      blog.title = title;
      blog.content = content;
      blog.author = author;
  
      await blog.save();
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });
  
module.exports = router; // ✅ Use CommonJS export
