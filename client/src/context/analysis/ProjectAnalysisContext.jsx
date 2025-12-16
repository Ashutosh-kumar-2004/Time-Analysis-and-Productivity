import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProjectAnalysisContext = createContext();

export const useProjectAnalysisContext = () => useContext(ProjectAnalysisContext);

export const ProjectAnalysisProvider = ({ children }) => {
  const { projectID: projectId } = useParams(); // Get projectId from the route (aliased from projectID)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
        // If no projectId, we cannot fetch. 
        // Depending on where this Provider is placed, projectId might be undefined if outside the route.
        // In AppRoutes, it is inside /project-details/:projectId/analysis so it should be fine.
      if (!projectId) return;

      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/analytics`, {
            withCredentials: true,
             headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setAnalysisData(response.data.data);
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setError(err.response?.data?.message || "Failed to fetch analysis");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [projectId]);

  const value = {
    loading,
    error,
    analysisData,
    projectId, // expose projectId if needed
    refetch: () => { /* optional refetch logic */ }
  };

  return (
    <ProjectAnalysisContext.Provider value={value}>
      {children}
    </ProjectAnalysisContext.Provider>
  );
};
