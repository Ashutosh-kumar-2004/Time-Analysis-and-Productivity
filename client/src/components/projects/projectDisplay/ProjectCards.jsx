// components/ProjectCards.jsx
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import ProjectCard from "./ProjectCard";
import { HiOutlineInbox } from "react-icons/hi";

const ProjectCards = () => {
  // Get currentUserId from Redux state
  const { projects, filters, currentUserId } = useSelector((state) => ({
    projects: state.project.projects,
    filters: state.project.filters,
    currentUserId: state.project.currentUserId 
  }));

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          (project.managingUserName &&
            project.managingUserName.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.status !== "all") {
      result = result.filter(
        (project) => project.status.toLowerCase() === filters.status
      );
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "duration":
          return b.totalDuration - a.totalDuration;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [projects, filters]);

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <HiOutlineInbox className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No projects found matching your filters.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredProjects.map((project) => (
        <ProjectCard 
          key={project._id || project.id} 
          project={project} 
          currentUserId={currentUserId} 
        />
      ))}
    </div>
  );
};

export default ProjectCards;