const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    projectName: {
      type: String,
      required: true
    },

    canvasData: {
      type: Object,
      default: {}
    },

    thumbnail: {
      type: String,
      default: ""
    },

    currentVersion: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", ProjectSchema);