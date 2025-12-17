import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useFetchGoals = (status = "active") => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/goals?status=${status}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setGoals(response.data.data);
      }
    } catch (err) {
      console.error("Fetch goals error:", err);
      setError(err.message);
      // toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return { goals, loading, error, refetch: fetchGoals };
};

export default useFetchGoals;
