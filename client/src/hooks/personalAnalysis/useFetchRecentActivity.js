import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useFetchRecentActivity = (limit = 5) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/time-entries?limit=${limit}&sortBy=startTimestamp&sortOrder=desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setActivities(response.data.data);
      }
    } catch (err) {
      console.error("Fetch recent activity error:", err);
      setError(err.message);
      // Optional: toast.error('Failed to load recent activity');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, error, refetch: fetchActivities };
};

export default useFetchRecentActivity;
