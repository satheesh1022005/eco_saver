// utils/connectionPool.js
import mysql from "mysql2/promise";

const activeConnections = new Map();

/**
 * Add a new connection to the pool
 * @param {string} databaseId - Unique identifier for the connection (e.g., userId or databaseId)
 * @param {object} connection - The database connection instance
 */
const addConnection = (databaseId, connection) => {
  activeConnections.set(databaseId, connection);
};

/**
 * Get an existing connection from the pool
 * @param {string} databaseId - Unique identifier for the connection
 * @returns {object|null} - The database connection instance or null if not found
 */
const getConnection = (databaseId) => {
  return activeConnections.get(databaseId) || null;
};

/**
 * Remove a connection from the pool
 * @param {string} databaseId - Unique identifier for the connection
 */
const removeConnection = (databaseId) => {
  if (activeConnections.has(databaseId)) {
    activeConnections.get(databaseId).end(); // Close the connection
    activeConnections.delete(databaseId);
  }
};

export { activeConnections, addConnection, getConnection, removeConnection };
