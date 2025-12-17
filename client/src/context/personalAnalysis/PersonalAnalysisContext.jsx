import React, { createContext, useContext, useCallback } from "react";
import useFetchPersonalTasks from "../../hooks/personalAnalysis/useFetchPersonalTasks.jsx";

const PersonalAnalysisContext = createContext();

export const PersonalAnalysisProvider = ({ children }) => {
  const { tasks, loading, error, refetch } = useFetchPersonalTasks();

  const refreshTasks = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PersonalAnalysisContext.Provider
      value={{ tasks, loading, error, refreshTasks }}
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
