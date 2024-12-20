const router = require('express').Router();
const Joi = require('joi');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

router.post("/", async (req, res) => {
    try {
        // Validate request body
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({ message: "Invalid email or password." });
        }

        // Check if password is valid
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).send({ message: "Invalid email or password." });
        }

        // Generate token
        const token = user.generateAuthToken();

        // Include role in the response
        const isAdmin = user.role === "admin"; // Assuming the user schema has a "role" field

        res.status(200).send({
            data: token,
            message: 'Logged in successfully.',
            isAdmin, // Include isAdmin field in the response
        });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});

// Function to validate email and password fields
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
}

module.exports = router;
