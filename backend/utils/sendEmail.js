const nodemailer = require("nodemailer");
require("dotenv").config();


module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,                // e.g., smtp.gmail.com
            port: Number(process.env.EMAIL_PORT),   // e.g., 587
            secure: process.env.SECURE === "true",   // Convert to boolean
            auth: {
                user: process.env.USER,             // Your email
                pass: process.env.PASS,             // Your password or app password
            },
        });

        await transporter.sendMail({
            from: process.env.USER,                  // Sender email
            to: email,                               // Recipient email
            subject: subject,                        // Subject of the email
            text: text,                              // Email body
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.log("Email not sent!");
        console.error(error);  // Use console.error to log errors
        return error;
    }
};
