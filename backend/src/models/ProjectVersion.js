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
    },

    prompt: {
      type: String,
      default: ""
    },

    changeType: {
      type: String,
      enum: ["manual", "ai_create", "ai_refine", "ai_prototype"],
      default: "manual"
    },

    description: {
      type: String,
      default: ""
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