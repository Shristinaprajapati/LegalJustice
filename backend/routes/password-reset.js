const express = require('express');
const router = express.Router();

// Verify password reset link
router.get("/:id/:token", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({ message: "Invalid link" });

        res.status(200).send({ message: "Valid link" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Set new password
router.post("/:id/:token", async (req, res) => {
    try {
        const passwordSchema = Joi.object({
            password: passwordComplexity().required().label("Password"),
        });
        const { error } = passwordSchema.validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({ message: "Invalid link" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        user.password = hashPassword;
        await user.save();
        await token.remove();

        res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;