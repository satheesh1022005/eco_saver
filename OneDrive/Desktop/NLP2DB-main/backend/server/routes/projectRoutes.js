import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
//
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getHistory,
  createHistory,
} from "../controllers/projectController.js";
const router = express.Router();
router.post("/project/create-project", authMiddleware, createProject);
router.get("/project/get-projects", authMiddleware, getProjects);
router.get("/project/get-project/:id", authMiddleware, getProject);
router.post("/project/update-project/:id", authMiddleware, updateProject);
router.delete("/project/delete-project/:id", authMiddleware, deleteProject);
router.get("/project/queries/:projectId", authMiddleware, getHistory);
router.post("/project/create-history", authMiddleware, createHistory);

export default router;
