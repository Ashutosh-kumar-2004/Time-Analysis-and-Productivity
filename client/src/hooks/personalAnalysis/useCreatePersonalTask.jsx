import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useCreatePersonalTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user-tasks`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Task created successfully!");
        return response.data.data.task;
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create task";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTask, loading, error };
};

export default useCreatePersonalTask;
