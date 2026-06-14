const ProjectVersion =
require("../models/ProjectVersion");

const createVersion = async (
  projectId,
  canvasData,
  versionNumber
) => {
  return await ProjectVersion.create({
    projectId,
    canvasData,
    versionNumber
  });
};

module.exports = {
  createVersion
};