const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/user");
const router = express.Router();


router.get("/", async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ message: "Email not provided in the request." });
      }
  
      const user = await User.findOne({ email }).select("name email");
  
      if (!user) {
        return res.status(404).json({ message: "User not found in the database." });
      }
  
      return res.status(200).json({ name: user.name, email: user.email });
    } catch (error) {
      console.error("Error while fetching user details:", error);
      return res.status(500).json({ message: "Server error." });
    }
  });
  

module.exports = router;
