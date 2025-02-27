const express = require("express");
const router = express.Router();
const Service = require("../models/service"); // Import the Service model

// Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new service
router.post("/", async (req, res) => {
  const { title, description, price, category, formTemplate } = req.body;

  // Ensure category is either 'consulting' or 'documentation'
  if (!category || !['consulting', 'documentation'].includes(category)) {
    return res.status(400).json({ message: "Invalid category. Must be 'consulting' or 'documentation'." });
  }

  // If category is 'documentation', formTemplate is required
  if (category === 'documentation' && !formTemplate) {
    return res.status(400).json({ message: "Form template is required for documentation services" });
  }

  // Create new service
  const service = new Service({ title, description, price, category, formTemplate });

  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a service
router.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Edit (Update) a service
router.put("/:id", async (req, res) => {
  const { title, description, price, category, formTemplate } = req.body;

  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Ensure category is either 'consulting' or 'documentation'
    if (category && !['consulting', 'documentation'].includes(category)) {
      return res.status(400).json({ message: "Invalid category. Must be 'consulting' or 'documentation'." });
    }

    // If category is 'documentation', formTemplate is required
    if (category === 'documentation' && !formTemplate) {
      return res.status(400).json({ message: "Form template is required for documentation services" });
    }

    // Update service fields
    if (title !== undefined) service.title = title;
    if (description !== undefined) service.description = description;
    if (price !== undefined) service.price = price;
    if (category !== undefined) service.category = category;
    if (formTemplate !== undefined) service.formTemplate = formTemplate;

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
