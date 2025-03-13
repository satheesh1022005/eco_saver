import { pool } from "../config/db.js";
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.user;
    const userId = id;
    if (!name || !description) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    //check if the name already exists
    const [existingProject] = await pool.query(
      "SELECT * FROM projects WHERE project_name = ? AND user_id = ?",
      [name, userId]
    );

    if (existingProject.length > 0) {
      return res
        .status(400)
        .json({ msg: "Project name already exists for this user" });
    }
    const [result] = await pool.query(
      "INSERT INTO projects (project_name, description, user_id) VALUES (?, ?, ?)",
      [name, description, userId]
    );

    if (result.affectedRows === 1) {
      return res.status(201).json({ msg: "Project created successfully" });
    } else {
      return res.status(500).json({ msg: "Error creating project" });
    }
  } catch (err) {
    console.error("Error creating project:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getProjects = async (req, res) => {
  const { id } = req.user;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM projects WHERE user_id = ?",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getProject = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM projects WHERE project_id = ?",
      [id]
    );
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching project:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { erObject } = req.body;
  try {
    // Validate the erObject
    let jsonString;
    if (typeof erObject === "object") {
      jsonString = JSON.stringify(erObject); // Convert object to JSON string
    } else if (typeof erObject === "string") {
      // Validate if it's a proper JSON string
      try {
        JSON.parse(erObject); // Check if it's a valid JSON string
        jsonString = erObject;
      } catch (parseError) {
        return res
          .status(400)
          .json({ msg: "Invalid JSON format for erObject" });
      }
    } else {
      return res.status(400).json({ msg: "Invalid data type for erObject" });
    }

    // Check if the project exists
    const [rows] = await pool.query(
      "SELECT * FROM projects WHERE project_id = ? AND user_id = ?",
      [id, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Update the project
    const [result] = await pool.query(
      "UPDATE projects SET er_object = ? WHERE project_id = ?",
      [jsonString, id]
    );

    if (result.affectedRows === 1) {
      return res.status(200).json({ msg: "Project updated successfully" });
    } else {
      return res.status(500).json({ msg: "Error updating project" });
    }
  } catch (err) {
    console.error("Error updating project:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    // Check if the project exists
    const [rows] = await pool.query(
      "SELECT * FROM projects WHERE project_id = ? AND user_id = ?",
      [id, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Project not found" });
    }
    // Delete the project
    const [result] = await pool.query(
      "DELETE FROM projects WHERE project_id = ?",
      [id]
    );
    if (result.affectedRows === 1) {
      return res.status(200).json({ msg: "Project deleted successfully" });
    } else {
      return res.status(500).json({ msg: "Error deleting project" });
    }
  } catch (err) {
    console.error("Error deleting project:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getHistory = async (req, res) => {
  const { projectId } = req.params;

  try {
    const query = "SELECT * FROM queries WHERE project_id = ?";

    const [results] = await pool.query(query, [projectId]);

    if (results.length === 0) {
      // Send an empty array as JSON
      return res.json([]);
    }

    res.json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Error fetching queries");
  }
};

export const createHistory = async (req, res) => {
  const { projectId, queryText, queryResult } = req.body;

  const query = `INSERT INTO queries (project_id, query_text, query_result) VALUES (?, ?, ?)`;

  try {
    const [results] = await pool.query(query, [
      projectId,
      queryText,
      JSON.stringify(queryResult),
    ]);
    res.json({ success: true, chatId: results.insertId });
  } catch (err) {
    console.error("Error saving chat:", err);
    res.status(500).send("Error saving chat");
  }
};
