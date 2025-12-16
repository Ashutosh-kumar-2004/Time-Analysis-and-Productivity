import { useState, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../../../context/project/ProjectContext";

export const useAddSubtask = () => {
  const { setProject } = useContext(ProjectContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addSubtask = async (taskId, subtaskData) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/api/tasks/${taskId}/subtasks`,
        subtaskData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      const { subtask: newSubtask, task: updatedParentTask } = res.data?.data || {};

      if (!newSubtask || !updatedParentTask) return;

      // Update context
      setProject((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          tasks: prev.tasks.map((task) => {
            if (task._id === taskId) {
              return {
                ...task,
                estimatedHours: updatedParentTask.estimatedHours,
                subtasks: [...(task.subtasks || []), newSubtask],
              };
            }
            return task;
          }),
        };
      });

      return newSubtask;
    } catch (err) {
      console.error("Add subtask error:", err);
      setError(err.response?.data?.message || "Failed to add subtask");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addSubtask,
    loading,
    error,
  };
};
