import express from "express";
import {
  createAndActivateConnection,
  terminateConnection,
  executeQuery,
  createTable,
  getConnectionDetails,
} from "../controllers/deployController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

// router.post("/create-database-tables", createTable);
// router.post("/execute-sql", executeSQL);
router.post("/create-connection", authMiddleware, createAndActivateConnection);
router.delete(
  "/terminate-connection/:databaseId",
  authMiddleware,
  terminateConnection
);
router.post("/execute-query/:databaseId", authMiddleware, executeQuery);
router.post("/create-table/:databaseId", authMiddleware, createTable);
router.get(
  "/get-connection-details/:projectId",
  authMiddleware,
  getConnectionDetails
);

export default router;
