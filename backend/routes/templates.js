const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const Template = require("../models/template");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const FileType = require("file-type"); // Updated import for modern version

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    cb(null, true);
  } else {
    cb(new Error("Only .docx files are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// Utility function to extract placeholders
const extractPlaceholders = (fileBuffer) => {
  try {
    const content = fileBuffer.toString("binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    return Object.keys(doc.getTags());
  } catch (err) {
    console.error("Error extracting placeholders:", err.message);
    throw new Error("Invalid .docx file or unsupported format.");
  }
};

// Utility function to replace placeholders and generate a new file
const generateDocument = (fileBuffer, data) => {
  try {
    const content = fileBuffer.toString("binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    doc.render(data); // Replace placeholders with provided data

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    return buffer;
  } catch (err) {
    console.error("Error generating document:", err.message);
    throw new Error("Could not process the document.");
  }
};

// Upload a template
router.post("/upload", upload.single("file"), async (req, res) => {
  const { name, category } = req.body;
  const file = req.file;

  if (!file || !name || !category) {
    return res.status(400).send({ message: "File, name, and category are required." });
  }

  try {
    // Validate file type
    const fileType = await FileType.fromBuffer(file.buffer);
    if (!fileType || fileType.mime !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return res.status(400).send({ message: "Invalid file format. Only .docx files are allowed." });
    }

    const placeholders = extractPlaceholders(file.buffer);
    const template = new Template({
      name,
      category,
      fileData: file.buffer,
      placeholders,
    });

    await template.save();
    res.status(200).send({ message: "Template uploaded successfully.", template });
  } catch (err) {
    console.error("Error saving template:", err.message);
    res.status(500).send({ message: "Internal Server Error", error: err.message });
  }
});

// Get templates by category
router.get("/", async (req, res) => {
  const { category = "All" } = req.query;

  try {
    const templates =
      category === "All"
        ? await Template.find()
        : await Template.find({ category });

    res.status(200).send(templates);
  } catch (err) {
    console.error("Error fetching templates:", err.message);
    res.status(500).send({ message: "Internal Server Error", error: err.message });
  }
});

// Download a template
router.get("/download/:id", async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).send({ message: "Template not found." });
    }

    res.setHeader("Content-Disposition", `attachment; filename=${template.name}.docx`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.send(template.fileData);
  } catch (err) {
    console.error("Error downloading template:", err.message);
    res.status(500).send({ message: "Internal Server Error", error: err.message });
  }
});

// Edit a template and save it
router.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { data } = req.body; // Assume `data` is an object containing placeholder values

  if (!data || typeof data !== "object") {
    return res.status(400).send({ message: "Invalid data provided for editing." });
  }

  try {
    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).send({ message: "Template not found." });
    }

    const updatedFile = generateDocument(template.fileData, data);

    // Save the updated file back to MongoDB
    template.fileData = updatedFile;
    await template.save();

    res.status(200).send({ message: "Template updated successfully.", template });
  } catch (err) {
    console.error("Error editing template:", err.message);
    res.status(500).send({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
