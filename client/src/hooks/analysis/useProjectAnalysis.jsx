import { useState, useEffect } from "react";
import axios from "axios";

export const useProjectAnalysis = (projectId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    // Placeholder for fetching data
    const fetchAnalysis = async () => {
      if (!projectId) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnalysisData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch analysis");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [projectId]);

  return { loading, error, analysisData };
};
