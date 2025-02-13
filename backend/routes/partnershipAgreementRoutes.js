const express = require("express");
const Agreement = require("../models/partnershipagreement");

const router = express.Router();

// POST 
router.post("/", async (req, res) => {
  try {
    const agreement = new Agreement(req.body);
    await agreement.save();
    res.status(201).json({ message: "Agreement saved successfully!", agreement });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET 
router.get("/", async (req, res) => {
  try {
    const agreements = await Agreement.find();
    res.json(agreements);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// GET by clientId
router.get("/:clientId", async (req, res) => {
  const { clientId } = req.params; // Access clientId from the URL parameter

  try {
    const agreement = await Agreement.find({ clientId: clientId }); // Find agreements by clientId

    if (!agreement || agreement.length === 0) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    res.json(agreement);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
