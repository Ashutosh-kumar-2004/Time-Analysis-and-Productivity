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
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/time-entries`,
        { taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Time tracking started");
      return res.data.data.timeEntry;
    } catch (err) {
      console.error("Start tracking error:", err);
      if (
        err.response?.data?.error === "Validation Error" &&
        err.response?.data?.message?.includes("already have an active")
      ) {
        toast.warning("You already have an active timer. Stop it first.");
      } else {
        toast.error(err.response?.data?.message || "Failed to start tracking");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const stopTrackingList = useCallback(async (entryId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/time-entries/${entryId}/stop`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Time tracking stopped");
      return true;
    } catch (err) {
      console.error("Stop tracking error:", err);
      toast.error(err.response?.data?.message || "Failed to stop tracking");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActiveEntry = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/time-entries/current`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      // 404 is expected if no active entry
      if (err.response?.status !== 404) {
        console.error("Fetch active entry error:", err);
      }
      return null;
    }
  }, []);

  return {
    updateTaskStatus,
    startTrackingList,
    stopTrackingList,
    fetchActiveEntry,
    loading,
  };
};

export default useTaskActions;
