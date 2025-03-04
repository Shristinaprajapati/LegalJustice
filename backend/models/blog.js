const mongoose = require("mongoose");
const slugify = require("slugify"); // Ensure slugify is installed via npm

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    publishedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Generate slug before saving
BlogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Blog", BlogSchema); // ✅ Use CommonJS export
