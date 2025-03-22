// routes/contentRoutes.js
const express = require("express");
const Content = require("../models/content");
const router = express.Router();

// POST: Create or update content
router.post("/content", async (req, res) => {
  const { type, content } = req.body;

  try {
    // Check if content already exists for the given type
    let existingContent = await Content.findOne({ type });

    if (existingContent) {
      // Update existing content
      existingContent.content = content;
      existingContent.lastUpdated = Date.now();
      await existingContent.save();
      res.status(200).json({ message: "Content updated successfully!", content: existingContent });
    } else {
      // Create new content
      const newContent = new Content({ type, content });
      await newContent.save();
      res.status(201).json({ message: "Content created successfully!", content: newContent });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET: Fetch content by type
router.get("/content/:type", async (req, res) => {
  const { type } = req.params;

  try {
    const content = await Content.findOne({ type });
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT: Edit content by type
router.put("/content/:type", async (req, res) => {
  const { type } = req.params;
  const { content } = req.body;

  try {
    const updatedContent = await Content.findOneAndUpdate(
      { type },
      { content, lastUpdated: Date.now() },
      { new: true } // Return the updated document
    );

    if (!updatedContent) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.status(200).json({ message: "Content updated successfully!", content: updatedContent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;