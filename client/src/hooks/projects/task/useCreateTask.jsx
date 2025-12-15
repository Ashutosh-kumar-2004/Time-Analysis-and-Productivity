import { useState } from "react";
import axios from "axios";
import { ProjectContext } from "../../../context/project/ProjectContext";
import { useContext } from "react";

export const useCreateTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { project, setProject } = useContext(ProjectContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const createTask = async (taskPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/api/tasks`, taskPayload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      setSuccess(true);
      const newTask = res.data.data.task;
      setProject((prevProject) => ({
        ...prevProject,
        tasks: [...(prevProject.tasks || []), newTask],
      }));
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to create task";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTask,
    loading,
    error,
    success,
  };
};
