import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useDailyCheckIn = () => {
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState(null);

  const fetchTodayCheckIn = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/daily-check-in/today`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success && res.data.data) {
        setCheckIn(res.data.data);
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.error("Fetch check-in error:", err);
      // Don't toast on 404/null, just return null
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCheckIn = useCallback(async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/daily-check-in`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setCheckIn(res.data.data);
        toast.success("Daily check-in saved successfully!");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Save check-in error:", err);
      toast.error(err.response?.data?.message || "Failed to save check-in");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCheckInHistory = useCallback(async (page = 1, limit = 7) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/daily-check-in/history?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        return res.data;
      }
      return null;
    } catch (err) {
      console.error("Fetch history error:", err);
      toast.error("Failed to load history");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    checkIn,
    loading,
    fetchTodayCheckIn,
    saveCheckIn,
    fetchCheckInHistory,
  };
};

export default useDailyCheckIn;
