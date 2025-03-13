import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export async function sendVerificationEmail(email, verificationToken) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can change this to your email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    const verificationUrl = `https://nlp2db.onrender.com/api/auth/verify-email/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Click on the link to verify your email: ${verificationUrl}`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    //console.log("Verification email sent:", info.response);
  } catch (err) {
    //console.error("Error sending email:", err);
    throw new Error("Error sending verification email");
  }
}
