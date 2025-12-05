import { createSlice } from "@reduxjs/toolkit";
import {
  getProjects,
  addProject,
  deleteProject,
  restoreProject,
} from "./projectThunks";

const initialState = {
  projects: [],
  loading: false,
  error: null,
  currentUserId: null,
  filters: {
    sortBy: "newest",
    status: "all",
    search: "",
    priority: "all",
    tag: "",
    search: "",
  },
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateProject: (state, action) => {
      const { id, data } = action.payload;
      const index = state.projects.findIndex((p) => p._id === id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...data };
      }
    },
  },

  extraReducers: (builder) => {
    // GET PROJECTS
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;

        // Extract projects array
        if (action.payload.projects && Array.isArray(action.payload.projects)) {
          state.projects = action.payload.projects;
        }

        // Extract currentUserId
        if (action.payload.currentUserId) {
          state.currentUserId = action.payload.currentUserId;
        }
      })
      .addCase(getProjects.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch projects";
      });

    // ADD PROJECT
    builder
      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false;

        // Add the new project to state
        if (action.payload.project) {
          state.projects.push(action.payload.project);
        }
      })
      .addCase(addProject.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to add project";
      });

    // DELETE PROJECT (SOFT DELETE/ARCHIVE)
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;

        // Get the updated project from API response
        const updatedProject = action.payload.project;

        // Find and update the project (set archived: true)
        if (updatedProject) {
          const index = state.projects.findIndex(
            (p) => p._id === updatedProject._id
          );
          if (index !== -1) {
            state.projects[index] = updatedProject;
          }
        }
      })
      .addCase(deleteProject.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to archive project";
      });

    // RESTORE PROJECT
    builder
      .addCase(restoreProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreProject.fulfilled, (state, action) => {
        state.loading = false;

        // Get the restored project from API response
        const restoredProject = action.payload.project;

        // Find and update the project (set archived: false)
        if (restoredProject) {
          const index = state.projects.findIndex(
            (p) => p._id === restoredProject._id
          );
          if (index !== -1) {
            state.projects[index] = restoredProject;
          }
        }
      })
      .addCase(restoreProject.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to restore project";
      });
  },
});

export const { setFilters, updateProject } = projectSlice.actions;
export default projectSlice.reducer;
