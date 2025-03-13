import jwt from "jsonwebtoken";
import { pool } from "../config/db.js"; // Import MySQL connection pool
import { secret } from "../config/jwt.js"; // Import the secret from your jwt config

const authMiddleware = async (req, res, next) => {
  const token = req.header("x-auth-token");
  //console.log(token);
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;

    // Query to check if the user exists in the database
    const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
      req.user.id,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ msg: "Authorization denied" });
    }

    next();
  } catch (err) {
    console.error("Token validation error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authMiddleware;
