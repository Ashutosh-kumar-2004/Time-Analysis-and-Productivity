import React, { createContext, useContext, useCallback, useState } from "react";
import axios from "axios";
import useFetchPersonalTasks from "../../hooks/personalAnalysis/useFetchPersonalTasks.jsx";
import useTaskActions from "../../hooks/personalAnalysis/useTaskActions";

const PersonalAnalysisContext = createContext();

export const PersonalAnalysisProvider = ({ children }) => {
  const { tasks, loading, error, refetch } = useFetchPersonalTasks({
    limit: 1000,
  });
  const [activeTimeEntry, setActiveTimeEntry] = React.useState(null);
  const { fetchActiveEntry } = useTaskActions();

  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const refreshTasks = useCallback(async () => {
    refetch();
    const active = await fetchActiveEntry();
    setActiveTimeEntry(active);
    setRefreshTrigger((prev) => prev + 1); // Trigger other listeners
  }, [refetch, fetchActiveEntry]);

  // Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);

  const fetchDashboardStats = useCallback(
    async (timeRange = "This Week", customDates = null) => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const token = localStorage.getItem("token");
        let url = `${
          import.meta.env.VITE_API_URL
        }/api/personal-analysis/dashboard?timeRange=${timeRange}`;

        if (timeRange === "custom" && customDates) {
          url += `&startDate=${customDates.startDate}&endDate=${customDates.endDate}`;
        }

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setStatsError(err.message);
      } finally {
        setStatsLoading(false);
      }
    },
    []
  );

  // Initial fetch of active entry
  React.useEffect(() => {
    const loadActive = async () => {
      const active = await fetchActiveEntry();
      setActiveTimeEntry(active);
    };
    loadActive();
  }, [fetchActiveEntry]);

  return (
    <PersonalAnalysisContext.Provider
      value={{
        tasks,
        loading,
        error,
        refreshTasks,
        activeTimeEntry,
        setActiveTimeEntry,
        refreshTrigger,
        dashboardStats,
        statsLoading,
        statsError,
        fetchDashboardStats,
      }}
    >
      {children}
    </PersonalAnalysisContext.Provider>
  );
};

export const usePersonalAnalysis = () => {
  const context = useContext(PersonalAnalysisContext);
  if (!context) {
    throw new Error(
      "usePersonalAnalysis must be used within a PersonalAnalysisProvider"
    );
  }
  return context;
};

export default PersonalAnalysisContext;
