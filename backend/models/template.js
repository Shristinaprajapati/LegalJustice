const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    fileData: { type: Buffer, required: true }, // Store the .docx file as binary data
    placeholders: { type: [String], default: [] }, // Explicitly define as an array of strings
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const Template = mongoose.model("Template", TemplateSchema);

module.exports = Template;
