import { useState, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../../../context/project/ProjectContext";

const useUpdateTask = () => {
  const { project, setProject } = useContext(ProjectContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTask = async (taskId, updates) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API_URL}/tasks/${taskId}`, updates, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      const updatedTask = res.data?.data?.task;
      if (!updatedTask) return;

      //  Update task inside project context
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task._id === taskId ? { ...task, ...updatedTask } : task
        ),
      }));

      return updatedTask;
    } catch (err) {
      console.error("Update task error:", err);
      setError(err.response?.data?.message || "Failed to update task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateTask,
    loading,
    error,
  };
};

export default useUpdateTask;
