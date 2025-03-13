import mysql from "mysql2/promise";
import { pool } from "../config/db.js";
import {
  addConnection,
  getConnection,
  removeConnection,
} from "../utils/connectionPool.js";

// Create and Activate Connection
export const createAndActivateConnection = async (req, res) => {
  const { projectId, connectionDetails } = req.body;
  const databaseName = connectionDetails.database;
  try {
    // Connect to the MySQL server without specifying the database
    const connection = await mysql.createConnection({
      host: connectionDetails.host,
      user: connectionDetails.user,
      password: connectionDetails.password,
      port: connectionDetails.port,
    });

    // Check if the database exists
    const [rows] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [databaseName]
    );

    if (rows.length === 0) {
      // Database does not exist, create it
      await connection.query(`CREATE DATABASE ??`, [databaseName]);
    }

    // Close the initial connection
    await connection.end();

    // Reconnect with the specific database
    const dbConnection = await mysql.createConnection({
      host: connectionDetails.host,
      user: connectionDetails.user,
      password: connectionDetails.password,
      database: databaseName,
      port: connectionDetails.port,
    });

    const databaseId = `${projectId}_${databaseName}`;
    addConnection(databaseId, dbConnection);
    connectionDetails.databaseId = databaseId;
    const [add] = await pool.query(
      `INSERT INTO database_data (database_id, project_id, database_name, status, connection_details)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         project_id = VALUES(project_id),
         database_name = VALUES(database_name),
         status = VALUES(status),
         connection_details = VALUES(connection_details)`,
      [
        databaseId,
        projectId,
        databaseName,
        true,
        JSON.stringify(connectionDetails),
      ]
    );

    res.status(200).json({
      success: true,
      message:
        "Database created (if not existing) and connection activated successfully",
      databaseId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Terminate Connection
export const terminateConnection = (req, res) => {
  const { databaseId } = req.params;

  try {
    removeConnection(databaseId);
    res
      .status(200)
      .json({ success: true, message: "Connection terminated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Execute Query
export const executeQuery = async (req, res) => {
  const { databaseId } = req.params;
  const { query } = req.body;

  try {
    const connection = getConnection(databaseId);
    if (!connection) {
      return res
        .status(404)
        .json({ success: false, message: "Connection not found" });
    }

    const [rows] = await connection.execute(query);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export async function createTable(req, res) {
  const { databaseId } = req.params;
  const { queries } = req.body;

  // Validate input
  if (!databaseId || !Array.isArray(queries) || queries.length === 0) {
    return res
      .status(400)
      .send("Invalid input: databaseId and queries array are required");
  }

  try {
    // Get the connection from the pool using the databaseId
    const connection = getConnection(databaseId);

    // If connection is not found, return an error response
    if (!connection) {
      return res
        .status(404)
        .json({ success: false, message: "Connection not found" });
    }

    // Execute queries sequentially using promises
    let queryIndex = 0;

    // Recursive function to execute queries one by one
    async function executeNextQuery() {
      if (queryIndex < queries.length) {
        const currentQuery = queries[queryIndex];

        try {
          // Execute the current query using promise-based query
          await connection.query(currentQuery);
        } catch (err) {
          return res.status(500).json({
            success: false,
            message: `Error executing query for step ${queryIndex + 1}: ${
              err.message
            }`,
          });
        }

        // Move to the next query
        queryIndex++;
        executeNextQuery(); // Recursively execute the next query
      } else {
        // All queries executed successfully
        res.json({
          success: true,
          message: "All queries executed successfully",
        });
      }
    }

    // Start executing the queries
    await executeNextQuery();
  } catch (error) {
    console.error("Error in createTable:", error.message);
    res.status(500).json({
      success: false,
      message: "Error executing the table creation queries",
    });
  }
}

export async function getConnectionDetails(req, res) {
  const { projectId } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM database_data WHERE project_id = ?",
      [projectId]
    );
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
}
