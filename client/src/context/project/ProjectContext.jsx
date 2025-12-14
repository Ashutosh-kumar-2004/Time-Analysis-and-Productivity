import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProjectDetails } from "../../hooks/projects/useProjectDetails";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { projectID } = useParams();
  const {
    project: initialProject,
    loading,
    fetchProjectDetails,
  } = useProjectDetails(projectID);
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (initialProject) setProject(initialProject);
  }, [initialProject]);

  return (
    <ProjectContext.Provider
      value={{ project, setProject, loading, fetchProjectDetails }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};
