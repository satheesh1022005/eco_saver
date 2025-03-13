import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authMiddleware from "./middleware/authMiddleware.js"; // Import the middleware
import { pool } from "./config/db.js";
import deployRoutes from "./routes/deployRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
// Initialize Express app
const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  return res.json({ msg: "Server is running" });
});
app.use("/api", deployRoutes);
app.use("/api", authRoutes);
app.use("/api", projectRoutes);
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
