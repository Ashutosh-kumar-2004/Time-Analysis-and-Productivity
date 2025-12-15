import { useState, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../../../context/project/ProjectContext";

export const useDeleteTask = () => {
  const { project, setProject } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");

      // Make DELETE request
      await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      // Remove the task from project in context
      setProject((prevProject) => ({
        ...prevProject,
        tasks: (prevProject.tasks || []).filter((task) => task._id !== taskId),
      }));

      setSuccess(true);
      return true;
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete task";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteTask,
    loading,
    error,
    success,
  };
};
