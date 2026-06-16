const ProjectVersion =
require("../models/ProjectVersion");

const createVersion = async (
  projectId,
  canvasData,
  versionNumber,
  prompt = "",
  changeType = "manual",
  description = ""
) => {
  return await ProjectVersion.create({
    projectId,
    canvasData,
    versionNumber,
    prompt,
    changeType,
    description
  });
};

module.exports = {
  createVersion
};