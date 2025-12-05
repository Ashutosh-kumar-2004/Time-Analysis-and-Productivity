import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiEye, FiTrash2, FiFlag, FiTag, FiArchive, FiRotateCcw, FiCalendar, FiUsers, FiClock } from "react-icons/fi";
import { BsFolder } from "react-icons/bs";
import { formatDateTime, formatDuration } from "../../../constants";
import { restoreProject, hardDeleteProject } from "../../../redux/projects/projectThunks";

const ArchivedProjectCard = ({ project }) => {
  const dispatch = useDispatch();

  const handleRestore = (e) => {
    e.stopPropagation();
    if (window.confirm(`Restore "${project.name}" to active projects?`)) {
      dispatch(restoreProject(project._id));
    }
  };

  const handlePermanentDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`⚠️ WARNING: This will PERMANENTLY delete "${project.name}"!\n\nThis action cannot be undone. Are you sure?`)) {
      dispatch(hardDeleteProject(project._id));
    }
  };

  // Format archived duration
  const getArchivedDuration = () => {
    if (!project.updatedAt) return "Recently";
    
    const archivedDate = new Date(project.updatedAt);
    const now = new Date();
    const diffMs = now - archivedDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Get original status color (for reference)
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "started":
        return "text-blue-600 dark:text-blue-400";
      case "in progress":
        return "text-yellow-600 dark:text-yellow-400";
      case "completed":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  // Get original priority color (for reference)
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "text-green-600 dark:text-green-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "high":
        return "text-orange-600 dark:text-orange-400";
      case "critical":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
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
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200">
      {/* Header with archive info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <FiArchive className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Archived</span>
            <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
              {getArchivedDuration()}
            </span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Archived on {project.updatedAt ? formatDateTime(project.updatedAt) : "Unknown date"}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <BsFolder className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 line-through">
                {project.name}
              </h3>
            </div>

            {/* Original status and priority (for reference) */}
            <div className="flex flex-wrap gap-2 mb-2">
              {project.status && (
                <span className={`text-xs font-medium ${getStatusColor(project.status)}`}>
                  Formerly: {project.status}
                </span>
              )}
              {project.priority && (
                <span className={`text-xs font-medium flex items-center gap-1 ${getPriorityColor(project.priority)}`}>
                  <FiFlag className="w-3 h-3" />
                  {project.priority} priority
                </span>
              )}
            </div>

            {/* Manager info */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Managed by {getManagerName()}
            </p>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-500 mb-3 line-clamp-2">
              {project.description || "No description provided"}
            </p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                <FiTag className="w-3 h-3 text-gray-400 dark:text-gray-600 mt-1" />
                {project.tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 4 && (
                  <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">
                    +{project.tags.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/project-details/${project._id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <FiEye className="w-4 h-4" />
            View Details
          </Link>
        </div>
      </div>

      {/* Project Stats */}
      <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Duration */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <FiClock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Duration</p>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                {formatDuration(project.totalDuration)}
              </p>
            </div>
          </div>

          {/* Team Members */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <FiUsers className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Team Size</p>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                {project.teamMembers?.length || 0} members
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <FiCalendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Created</p>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          {/* Tasks */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <BsFolder className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Tasks</p>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                {project.tasks?.length || 0} tasks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Project ID: <span className="font-mono text-xs">{project._id?.substring(0, 8)}...</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRestore}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <FiRotateCcw className="w-4 h-4" />
            Restore Project
          </button>

          <button
            onClick={handlePermanentDelete}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete Permanently
          </button>
        </div>
      </div>

      {/* Warning message for permanent delete */}
      <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400">
        ⚠️ Permanent deletion will remove this project and all associated data forever.
      </div>
    </div>
  );
};

export default ArchivedProjectCard;