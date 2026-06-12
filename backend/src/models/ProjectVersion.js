const mongoose = require("mongoose");

const ProjectVersionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    versionNumber: {
      type: Number,
      required: true
    },

    canvasData: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "ProjectVersion",
  ProjectVersionSchema
);