const router = require('express').Router();
const { User, validate } = require('../models/user');
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    try {
        // Validate request body
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        // Check if user with the same email already exists
        const user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(409).send({ message: "User with given email already exists!" });

        // Hash password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Create and save the new user
        const newUser = new User({ ...req.body, password: hashPassword });
        await newUser.save();

        // Return success message
        res.status(201).send({ message: "User created successfully!" });
    } catch (error) {
        // Handle internal server error
        console.error(error); // Optionally log the error for debugging
        res.status(500).send({ message: "Internal Server Error." });
    }
});

// Fetch user by email
router.get('/', async (req, res) => {
    const { email } = req.query; // Extract email from query parameters
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Only return the necessary fields (e.g., _id,name, email, phone)
      const {_id, name, phone } = user;
      res.json({ _id, name, email, phone });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

module.exports = router;
