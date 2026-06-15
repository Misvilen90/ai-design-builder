import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const API = axios.create({
  baseURL: "/api",
});

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProjects = () =>
  API.get("/projects");

export const getProjectById = (id: string) =>
  API.get(`/projects/${id}`);

export const createProject = (projectName: string) =>
  API.post("/projects", { projectName });

export const renameProject = (
  id: string,
  projectName: string
) =>
  API.put(`/projects/${id}`, {
    projectName,
  });

export const deleteProject = (id: string) =>
  API.delete(`/projects/${id}`);

export const updateCanvas = (
  projectId: string,
  canvasData: any
) =>
  API.put(`/projects/${projectId}/canvas`, {
    canvasData,
  });

export const getCanvas = (projectId: string) =>
  API.get(`/projects/${projectId}/canvas`);

export const createVersion = (projectId: string) =>
  API.post(`/projects/${projectId}/version`);

export const getVersions = (projectId: string) =>
  API.get(`/projects/${projectId}/version`);

export const restoreVersion = (
  projectId: string,
  versionId: string
) =>
  API.post(
    `/projects/${projectId}/version/${versionId}/restore`
  );