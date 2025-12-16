import { useState, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../../../context/project/ProjectContext";

export const useAddTeamMember = () => {
  const { setProject } = useContext(ProjectContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addTeamMember = async (projectId, userId) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      // Verify projectId and userId are present
      if (!projectId || !userId) {
        throw new Error("Project ID and User ID are required");
      }

      const res = await axios.post(
        `${API_URL}/api/projects/${projectId}/members`,
        { userId },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      const newMember = res.data?.member;

      if (!newMember) {
        throw new Error("Failed to get added member data");
      }

      // Update context
      setProject((prev) => {
        if (prev._id === projectId) {
          return {
            ...prev,
            teamMembers: [...(prev.teamMembers || []), newMember],
          };
        }
        return prev;
      });

      return newMember;
    } catch (err) {
      console.error("Add team member error:", err);
      // Handle axios error or standard error
      const message = err.response?.data?.message || err.message || "Failed to add team member";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addTeamMember,
    loading,
    error,
  };
};
