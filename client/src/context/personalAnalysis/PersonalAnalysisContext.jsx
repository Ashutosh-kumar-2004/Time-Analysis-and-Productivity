import React, { createContext, useContext, useCallback } from "react";
import useFetchPersonalTasks from "../../hooks/personalAnalysis/useFetchPersonalTasks.jsx";
import useTaskActions from "../../hooks/personalAnalysis/useTaskActions";

const PersonalAnalysisContext = createContext();

export const PersonalAnalysisProvider = ({ children }) => {
  const { tasks, loading, error, refetch } = useFetchPersonalTasks({
    limit: 1000,
  });
  const [activeTimeEntry, setActiveTimeEntry] = React.useState(null);
  const { fetchActiveEntry } = useTaskActions();

  const refreshTasks = useCallback(async () => {
    refetch();
    const active = await fetchActiveEntry();
    setActiveTimeEntry(active);
  }, [refetch, fetchActiveEntry]);

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
