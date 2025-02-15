// const nodemailer = require("nodemailer");
// require("dotenv").config();


// module.exports = async (email, subject, text) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: process.env.HOST,                // e.g., smtp.gmail.com
//             port: Number(process.env.EMAIL_PORT),   // e.g., 587
//             secure: process.env.SECURE === "true",   // Convert to boolean
//             auth: {
//                 user: process.env.USER,             // Your email
//                 pass: process.env.PASS,             // Your password or app password
//             },
//         });

//         await transporter.sendMail({
//             from: process.env.USER,                  // Sender email
//             to: email,                               // Recipient email
//             subject: subject,                        // Subject of the email
//             text: text,                              // Email body
//         });

//         console.log("Email sent successfully");
//     } catch (error) {
//         console.log("Email not sent!");
//         console.error(error);  // Use console.error to log errors
//         return error;
//     }
// };


const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (email, subject, text, file) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,                // e.g., smtp.gmail.com
      port: Number(process.env.EMAIL_PORT),   // e.g., 587
      secure: process.env.SECURE === "true",   // Convert to boolean
      auth: {
        user: process.env.USER,               // Your email
        pass: process.env.PASS,               // Your password or app password
      },
    });

    // Prepare the mail options
    const mailOptions = {
      from: process.env.USER,                 // Sender email
      to: email,                              // Recipient email
      subject: subject,                       // Subject of the email
      text: text,                             // Email body
    };

    // If a file is provided, add it as an attachment
    if (file) {
      mailOptions.attachments = [
        {
          filename: file.originalname,       // The file name
          content: file.buffer,              // The file content as buffer
        },
      ];
    }

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not sent!");
    console.error(error);  // Log the error if the email fails to send
    return error;
  }
};
