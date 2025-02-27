const router = require("express").Router();
const Joi = require("joi");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios").default;

const SECRET_KEY = "6Lc5D6IqAAAAAAW78fRxvrv0xPHqBlGOHriC3b6P";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Store in .env

// Authentication route
router.post("/", async (req, res) => {
  try {
    const { recaptchaValue, email, password } = req.body;

    if (!recaptchaValue) {
      return res.status(400).send({ message: "reCAPTCHA value is required." });
    }

    // Verify reCAPTCHA
    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: SECRET_KEY,
          response: recaptchaValue,
        },
      }
    );

    if (!recaptchaResponse.data.success) {
      return res.status(400).send({
        message: "reCAPTCHA verification failed.",
        errorCodes: recaptchaResponse.data["error-codes"],
      });
    }

    // Validate email and password
    const { error } = validate({ email, password });
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password." });
    }

    // Check if password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid email or password." });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // If the user is a specific email, send a redirect response
    if (email === "shristiprajapati339@gmail.com") {
      return res.status(200).send({
        token,
        message: "Logged in successfully.",
        redirectTo: "http://localhost:3000/admin/AdminDashboard",
        user: { id: user._id, email: user.email, role: user.role },
      });
    }

    // Normal response for other users
    res.status(200).send({
      token,
      message: "Logged in successfully.",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Error during authentication:", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
});

// Function to validate email and password fields
const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

// User data fetch route
router.get('/me', async (req, res) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find the user by the ID from the decoded token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    // Send the user data back in the response
    res.send({
      name: user.name,
      email: user.email,
      clientId: user._id,
      role: user.role,
    });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(400).send({ message: 'Invalid token.' });
  }
});

module.exports = router;
