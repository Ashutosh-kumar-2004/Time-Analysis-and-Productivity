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

  const logManualTime = useCallback(async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/time-entries`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Time entry logged successfully");
      return res.data.success;
    } catch (err) {
      console.error("Log manual time error:", err);
      toast.error(err.response?.data?.message || "Failed to log time");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTimeEntry = useCallback(async (entryId, data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/time-entries/${entryId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Time entry updated successfully");
      return true;
    } catch (err) {
      console.error("Update time entry error:", err);
      toast.error(err.response?.data?.message || "Failed to update time entry");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTimeEntry = useCallback(async (entryId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/time-entries/${entryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Time entry deleted successfully");
      return true;
    } catch (err) {
      console.error("Delete time entry error:", err);
      toast.error(err.response?.data?.message || "Failed to delete time entry");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateTaskStatus,
    startTrackingList,
    stopTrackingList,
    fetchActiveEntry,
    logManualTime,
    updateTimeEntry,
    deleteTimeEntry,
    loading,
  };
};

export default useTaskActions;
