const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  renameProject,
  saveCanvasData,
  getCanvasData,
  getProjectVersions,
  createProjectVersion,
  restoreVersion 
} = require("../controllers/projectController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// All project routes require authentication
router.use(requireAuth);

router.post("/", createProject);

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.put("/:id/canvas", saveCanvasData);

router.get("/:id/canvas", getCanvasData);

router.post("/:id/version", createProjectVersion);

router.get("/:id/version", getProjectVersions);

router.post( "/:id/version/:versionId/restore", restoreVersion);

router.delete("/:id", deleteProject);

router.put("/:id", renameProject);

module.exports = router;