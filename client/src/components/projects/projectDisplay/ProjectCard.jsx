import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiEye, FiTrash2, FiFlag, FiTag, FiArchive } from "react-icons/fi";
import { BsFolder } from "react-icons/bs";
import { formatDateTime,formatDuration } from "../../../constants";
import { deleteProject } from "../../../redux/projects/projectThunks";

const ProjectCard = ({ project }) => {
  const dispatch = useDispatch();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      dispatch(deleteProject(project._id));
    }
  };


  // Get status badge styles
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "started":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "in progress":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  // Get priority badge styles
  const getPriorityStyles = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "high":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      case "critical":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  // Get project card background based on status
  const getCardBackground = () => {
    if (project.archived) {
      return "bg-gray-50 dark:bg-gray-800/50";
    }

    switch (project.status?.toLowerCase()) {
      case "started":
        return "bg-white dark:bg-gray-900";
      case "in progress":
        return "bg-white dark:bg-gray-900";
      case "completed":
        return "bg-white dark:bg-gray-900";
      default:
        return "bg-white dark:bg-gray-900";
    }
  };

  // Get border color based on status
  const getBorderColor = () => {
    if (project.archived) {
      return "border-gray-300 dark:border-gray-700";
    }

    switch (project.status?.toLowerCase()) {
      case "started":
        return "border-blue-200 dark:border-blue-800";
      case "in progress":
        return "border-yellow-200 dark:border-yellow-800";
      case "completed":
        return "border-green-200 dark:border-green-800";
      default:
        return "border-gray-200 dark:border-gray-800";
    }
  };

  // Get manager name
  const getManagerName = () => {
    if (project.managingUserId?.length > 0) {
      const manager = project.managingUserId[0];
      return `${manager.firstName} ${manager.lastName}`;
    }
    if (project.projectStartedBy) {
      return `${project.projectStartedBy.firstName} ${project.projectStartedBy.lastName}`;
    }
    return "No manager";
  };

  return (
    <div
      className={`rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 ${getCardBackground()} ${getBorderColor()} border`}
    >
      {/* Archived badge */}
      {project.archived && (
        <div className="flex items-center gap-1 mb-3 text-gray-600 dark:text-gray-400">
          <FiArchive className="w-4 h-4" />
          <span className="text-sm font-medium">Archived</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BsFolder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {project.name}
              </h3>

              {/* Status badge */}
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusStyles(
                  project.status
                )}`}
              >
                {project.status || "Unknown"}
              </span>

              {/* Priority badge */}
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 ${getPriorityStyles(
                  project.priority
                )}`}
              >
                <FiFlag className="w-3 h-3" />
                {project.priority || "medium"}
              </span>

              {/* Progress badge (placeholder for future) */}
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  project.progress === "completed"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                }`}
              >
                {project.progress || "in-progress"}
              </span>
            </div>

            {/* Manager info */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Managed by {getManagerName()}
            </p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                <FiTag className="w-3 h-3 text-gray-400 dark:text-gray-500 mt-1" />
                {project.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                    +{project.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/project-details/${project._id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <FiEye className="w-4 h-4" />
            View
          </Link>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed line-clamp-2">
        {project.description || "No description provided"}
      </p>

      {/* Stats section */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Start Date */}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Start Date
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {project.startDate
                ? formatDateTime(project.startDate)
                : "Not set"}
            </p>
          </div>

          {/* End Date */}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              End Date
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {project.endDate ? formatDateTime(project.endDate) : "Not set"}
            </p>
          </div>

          {/* Duration */}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Duration
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatDuration(project.totalDuration)}
            </p>
          </div>

          {/* Team Members */}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Team Members
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {project.teamMembers?.length || 0} active
            </p>

            {project.suspendedMembers?.length > 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {project.suspendedMembers.length} suspended
              </p>
            )}
          </div>

          {/* Progress bar */}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Progress
            </p>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  project.progress === "completed"
                    ? "w-full bg-green-500 dark:bg-green-400"
                    : "w-3/4 bg-blue-500 dark:bg-blue-400"
                }`}
              ></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {project.progress || "in-progress"}
            </p>
          </div>
        </div>

        {/* Created info */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Created {project.createdAt ? formatDateTime(project.createdAt) : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
