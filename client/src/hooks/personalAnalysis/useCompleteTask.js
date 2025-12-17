import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useCompleteTask = () => {
  const [loading, setLoading] = useState(false);

  const completeTask = useCallback(async (taskId, completionData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // completionData should include: { timeSpentInMinutes, focusScore, userRating, feedback: { whatWentWell, ... }, isCompleted: true }
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user-tasks/${taskId}/progress`,
        { ...completionData, isCompleted: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Task completed successfully! Great job! ");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Complete task error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to complete task";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { completeTask, loading };
};

export default useCompleteTask;
