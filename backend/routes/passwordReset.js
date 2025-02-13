const router = require("express").Router();
const { User } = require("../models/user");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");

// Send OTP for password reset
router.post("/", async (req, res) => {
	try {
		const emailSchema = Joi.object({
			email: Joi.string().email().required(),
		});
		const { error } = emailSchema.validate(req.body);
		if (error) return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user) return res.status(404).send({ message: "User not found" });

		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const token = await Token.findOneAndUpdate(
			{ userId: user._id },
			{ token: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }, // Store as Date object
			{ upsert: true, new: true }
		);

		const emailContent = `
			<p>Your OTP for resetting your password is:</p>
			<h3>${otp}</h3>
			<p>This OTP will expire in 10 minutes.</p>
		`;

		await sendEmail(user.email, "Password Reset OTP", emailContent);
		res.status(200).send({ message: "OTP sent to your email", userId: user._id });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
	try {
		const { userId, otp } = req.body;
		const token = await Token.findOne({ userId, token: otp });
		if (!token) return res.status(400).send({ message: "Invalid OTP" });

		if (new Date() > token.expiresAt) {  // Corrected date check
			await Token.deleteOne({ userId });
			return res.status(400).send({ message: "OTP expired" });
		}

		res.status(200).send({ message: "OTP verified. You can now reset your password.", userId });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

// Reset Password
router.post("/reset-password", async (req, res) => {
	try {
		const { userId, password } = req.body;
		const user = await User.findById(userId);
		if (!user) return res.status(404).send({ message: "User not found" });

		// Validate password
		const passwordSchema = passwordComplexity().validate(password);
		if (passwordSchema.error)
			return res.status(400).send({ message: passwordSchema.error.details[0].message });

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		await user.save();

		await Token.deleteOne({ userId });
		res.status(200).send({ message: "Password reset successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;
