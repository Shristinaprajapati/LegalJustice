const router = require("express").Router();
const Joi = require("joi");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const axios = require("axios").default;

const SECRET_KEY = "6Lc5D6IqAAAAAAW78fRxvrv0xPHqBlGOHriC3b6P";

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
      return res.status(400).send({ message: "reCAPTCHA verification failed." });
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
    const token = user.generateAuthToken();

    // Determine if user is admin
    const isAdmin = user.role === "admin"; // Assuming "role" field exists in schema

    res.status(200).send({
      data: token,
      message: "Logged in successfully.",
      isAdmin,
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

module.exports = router;
