const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	token: { type: String, required: true },
	expiresAt: { type: Date, default: () => Date.now() + 10 * 60 * 1000 }, // 10 minutes
});

module.exports = mongoose.model("Token", tokenSchema);
