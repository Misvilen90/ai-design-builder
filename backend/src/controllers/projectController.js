const Project = require("../models/Project");
const ProjectVersion =
require("../models/ProjectVersion");

const {
  createVersion
} = require("../services/versionService");

// Create Project
const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      userId: "demo-user",
      projectName: req.body.projectName,
      canvasData: req.body.canvasData
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get All Projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get Project By ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json({
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Rename Project
const renameProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        projectName: req.body.projectName
      },
      {
        returnDocument: 'after'
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Save Canvas Data
const saveCanvasData = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        canvasData: req.body.canvasData
      },
      {
        returnDocument: 'after'
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json({
      message: "Canvas saved successfully",
      project
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getCanvasData = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
  
      if (!project) {
        return res.status(404).json({
          message: "Project not found"
        });
      }
  
      res.status(200).json({
        canvasData: project.canvasData
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };


const createProjectVersion = async (
    req,
    res
  ) => {
    try {
      const project =
        await Project.findById(req.params.id);
  
      if (!project) {
        return res.status(404).json({
          message: "Project not found"
        });
      }
  
      const version =
        await ProjectVersion.countDocuments({
          projectId: project._id
        });
  
      const newVersion =
        await createVersion(
          project._id,
          project.canvasData,
          version + 1
        );
  
      res.status(201).json(newVersion);
  
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

  const getProjectVersions = async (
    req,
    res
  ) => {
    try {
      const versions =
        await ProjectVersion.find({
          projectId: req.params.id
        })
        .sort({ versionNumber: -1 });
  
      res.status(200).json(versions);
  
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

  const restoreVersion = async (req, res) => {
    try {
      const version = await ProjectVersion.findById(
        req.params.versionId
      );
  
      if (!version) {
        return res.status(404).json({
          message: "Version not found"
        });
      }
  
      const project = await Project.findByIdAndUpdate(
        req.params.id,
        {
          canvasData: version.canvasData
        },
        {
          returnDocument: 'after'
        }
      );
  
      res.status(200).json({
        message: "Version restored successfully",
        project
      });
  
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };


module.exports = {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  renameProject,
  saveCanvasData,
  getCanvasData,
  createProjectVersion,
  getProjectVersions,
  restoreVersion
};