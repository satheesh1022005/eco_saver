import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { pool } from "../config/db.js"; // MySQL connection pool
import { secret, expiresIn } from "../config/jwt.js"; // JWT secret from config
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
// User Registration
export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    // Check if user already exists
    const [userExists] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR name = ?",
      [email, name]
    );
    if (userExists.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Set token expiry time (1 hour)
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1);
    await sendVerificationEmail(email, verificationToken);
    // Create new user with verification token and expiry time
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, verification_token, token_expiry) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, verificationToken, tokenExpiry]
    );

    // Send verification email

    res.status(201).json({
      msg: "User registered successfully. Please check your email for verification.",
    });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
}
// User Login
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    // Check if user exists
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    if (!user[0].is_verified) {
      // Generate a new expiry time
      const newExpiry = new Date();
      newExpiry.setHours(newExpiry.getHours() + 1);

      // Update the expiry time in the database
      await pool.query("UPDATE users SET token_expiry = ? WHERE email = ?", [
        newExpiry,
        email,
      ]);

      // Resend the verification email
      const verificationToken = user[0].verification_token;
      await sendVerificationEmail(email, verificationToken);

      return res.status(400).json({
        msg: "Your email is not verified. A new verification link has been sent to your email.",
      });
    }
    // Generate JWT token
    const payload = {
      user: {
        id: user[0].user_id,
        name: user[0].name,
        email: user[0].email,
      },
    };

    const token = jwt.sign(payload, secret, { expiresIn: expiresIn });

    res.json({
      msg: "Login successful",
      token,
      user: payload.user,
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
}

export async function getUser(req, res) {
  try {
    const [user] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
      req.user.id,
    ]);
    res.json(user[0]);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
}

// Email Verification Route
export async function verifyEmail(req, res) {
  const { token } = req.params;

  try {
    // Check if the token exists in the database and is valid
    const [user] = await pool.query(
      "SELECT * FROM users WHERE verification_token = ? AND token_expiry > NOW()",
      [token]
    );

    if (user.length === 0) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // Update user to mark as verified
    await pool.query(
      "UPDATE users SET is_verified = true, verification_token = NULL, token_expiry = NULL WHERE verification_token = ?",
      [token]
    );

    res.status(200).json({ msg: "Email verified successfully!" });
  } catch (err) {
    console.error("Error during email verification:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
}
