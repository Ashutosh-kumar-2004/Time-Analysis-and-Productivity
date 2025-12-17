import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useTaskActions = () => {
  const [loading, setLoading] = useState(false);

  const updateTaskStatus = useCallback(async (taskId, status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user-tasks/${taskId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task updated successfully");
      return true;
    } catch (err) {
      console.error("Update task error:", err);
      toast.error(err.response?.data?.message || "Failed to update task");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const startTrackingList = useCallback(async (taskId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/time-entries`,
        { taskId }, // backend expects taskId in body
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Time tracking started");
      return true;
    } catch (err) {
      console.error("Start tracking error:", err);
      // Check if it's "already active entry" error and handle gracefully
      if (
        err.response?.data?.error === "Validation Error" &&
        err.response?.data?.message?.includes("already have an active")
      ) {
        toast.warning("You already have an active timer. Stop it first.");
      } else {
        toast.error(err.response?.data?.message || "Failed to start tracking");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTaskStatus, startTrackingList, loading };
};

export default useTaskActions;
