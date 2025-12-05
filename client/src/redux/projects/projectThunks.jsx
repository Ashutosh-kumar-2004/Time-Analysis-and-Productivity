import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api/projects";

// GET ALL PROJECTS
export const getProjects = createAsyncThunk(
  "projects/getProjects",
  async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API}/get-all-user-project`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // Full response
  }
);

// ADD PROJECT
export const addProject = createAsyncThunk(
  "projects/addProject",
  async (projectData) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API}/add-project`, projectData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // Full response
  }
);

// DELETE PROJECT (Soft Delete)
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId) => {
    const token = localStorage.getItem("token");
    const res = await axios.patch(
      `${API}/delete-project/${projectId}`,
      { archived: true },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data; // Full response
  }
);

// RESTORE PROJECT
export const restoreProject = createAsyncThunk(
  "projects/restoreProject",
  async (projectId) => {
    const token = localStorage.getItem("token");
    const res = await axios.patch(
      `${API}/restore-project/${projectId}`,
      { archived: false },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data; // Full response
  }
);