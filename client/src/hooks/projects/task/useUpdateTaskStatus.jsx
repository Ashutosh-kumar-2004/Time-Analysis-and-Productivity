import { useState, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../../../context/project/ProjectContext";

const useUpdateTaskStatus = () => {
  const { setProject } = useContext(ProjectContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTaskStatus = async (taskId, status) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.put(
        `${API_URL}/tasks/${taskId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      const updatedTask = res.data?.data?.task;
      if (!updatedTask) return;

      // accurate update
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                status: updatedTask.status,
                completedAt: updatedTask.completedAt,
              }
            : task
        ),
      }));

      return updatedTask;
    } catch (err) {
      console.error("Update status error:", err);
      setError(err.response?.data?.message || "Failed to update status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateTaskStatus,
    loading,
    error,
  };
};

export default useUpdateTaskStatus;
