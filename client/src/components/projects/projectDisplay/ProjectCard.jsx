import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FiEye,
  FiFlag,
  FiTag,
  FiArchive,
  FiRotateCcw,
  FiUser,
  FiShield,
} from "react-icons/fi";
import { BsFolder } from "react-icons/bs";
import { formatDateTime, formatDuration } from "../../../constants";
import {
  getStatusStyles,
  getPriorityStyles,
  getCardBackground,
  getBorderColor,
  getManagerName,
} from "../../../constants/projectConstants";
import {
  deleteProject,
  restoreProject,
} from "../../../redux/projects/projectThunks";

const ProjectCard = ({ project, showArchived = false, currentUserId }) => {
  const dispatch = useDispatch();

  // Check if current user is a manager
  const isCurrentUserManager = () => {
    if (!currentUserId || !project.managingUserId) return false;
    return project.managingUserId.some(manager => manager._id === currentUserId);
  };
  
  // Check if current user is project creator
  const isCurrentUserCreator = () => {
    if (!currentUserId || !project.projectStartedBy) return false;
    return project.projectStartedBy._id === currentUserId;
  };
  
  const canManageProject = isCurrentUserManager() || isCurrentUserCreator();
  const userRole = isCurrentUserCreator() ? "creator" : 
                  isCurrentUserManager() ? "manager" : 
                  "member";

  const handleArchive = (e) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to archive "${project.name}"?\n\nArchived projects can be restored later by managers.`
      )
    ) {
      dispatch(deleteProject(project._id));
    }
  };

  const handleRestore = (e) => {
    e.stopPropagation();
    if (window.confirm(`Restore "${project.name}" to active projects?`)) {
      dispatch(restoreProject(project._id));
    }
  };
console.log("Project data:", {
  name: project.name,
  managingUserId: project.managingUserId,
  firstManager: project.managingUserId?.[0],
  hasFirstName: project.managingUserId?.[0]?.firstName,
  projectStartedBy: project.projectStartedBy
});
  return (
    <div
      className={`rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 ${getCardBackground(
        project.archived,
        project.status
      )} ${getBorderColor(project.archived, project.status)} border`}
    >
      {/* Archived badge */}
      {project.archived && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <FiArchive className="w-4 h-4" />
            <span className="text-sm font-medium">Archived</span>
            <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
              {project.updatedAt
                ? `Archived on ${formatDateTime(project.updatedAt)}`
                : ""}
            </span>
          </div>
          
          {/* User role badge */}
          {currentUserId && (
            <div className={`text-xs px-2 py-1 rounded-full ${
              canManageProject
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}>
              {isCurrentUserCreator() && <FiUser className="inline w-3 h-3 mr-1" />}
              {isCurrentUserManager() && <FiShield className="inline w-3 h-3 mr-1" />}
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                project.archived
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "bg-blue-100 dark:bg-blue-900/30"
              }`}
            >
              <BsFolder
                className={`w-5 h-5 ${
                  project.archived
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3
                className={`text-lg font-semibold ${
                  project.archived
                    ? "text-gray-600 dark:text-gray-400 line-through"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {project.name}
              </h3>

              {/* Status badge - hidden if archived */}
              {!project.archived && (
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusStyles(
                    project.status
                  )}`}
                >
                  {project.status || "Unknown"}
                </span>
              )}

              {/* Priority badge - hidden if archived */}
              {!project.archived && (
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 ${getPriorityStyles(
                    project.priority
                  )}`}
                >
                  <FiFlag className="w-3 h-3" />
                  {project.priority || "medium"}
                </span>
              )}

              {/* Archived badge - if in main list but archived (shouldn't happen with filter) */}
              {project.archived && !showArchived && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  Archived
                </span>
              )}
            </div>

            {/* Manager info */}
            <p
              className={`text-sm ${
                project.archived
                  ? "text-gray-500 dark:text-gray-500"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Managed by {getManagerName(project)}
              {project.managingUserId?.length > 1 && (
                <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">
                  +{project.managingUserId.length - 1} more
                </span>
              )}
            </p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                <FiTag
                  className={`w-3 h-3 mt-1 ${
                    project.archived
                      ? "text-gray-400 dark:text-gray-600"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
                {project.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      project.archived
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      project.archived
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    +{project.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {/* View button - always shown */}
          <Link
            to={`/project-details/${project._id}`}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              project.archived
                ? "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                : "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            }`}
          >
            <FiEye className="w-4 h-4" />
            View
          </Link>

          {/* Action buttons based on archived status AND user permissions */}
          {project.archived ? (
            // Archived project actions - ONLY for managers
            canManageProject ? (
              <button
                onClick={handleRestore}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              >
                <FiRotateCcw className="w-4 h-4" />
                Restore
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-not-allowed" title="Only managers can restore archived projects">
                <FiRotateCcw className="w-4 h-4" />
                Restore
              </span>
            )
          ) : (
            // Active project action - Archive only for managers
            canManageProject ? (
              <button
                onClick={handleArchive}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
              >
                <FiArchive className="w-4 h-4" />
                Archive
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-not-allowed" title="Only managers can archive projects">
                <FiArchive className="w-4 h-4" />
                Archive
              </span>
            )
          )}
        </div>
      </div>

      {/* Description */}
      <p
        className={`mb-6 leading-relaxed line-clamp-2 ${
          project.archived
            ? "text-gray-500 dark:text-gray-500"
            : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {project.description || "No description provided"}
      </p>

      {/* Stats section - Dimmed if archived */}
      <div
        className={`rounded-lg p-4 ${
          project.archived
            ? "bg-gray-100 dark:bg-gray-800/30"
            : "bg-gray-50 dark:bg-gray-800"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Start Date */}
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                project.archived
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Start Date
            </p>
            <p
              className={`font-semibold ${
                project.archived
                  ? "text-gray-600 dark:text-gray-500"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {project.startDate
                ? formatDateTime(project.startDate)
                : "Not set"}
            </p>
          </div>

          {/* End Date */}
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                project.archived
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              End Date
            </p>
            <p
              className={`font-semibold ${
                project.archived
                  ? "text-gray-600 dark:text-gray-500"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {project.endDate ? formatDateTime(project.endDate) : "Not set"}
            </p>
          </div>

          {/* Duration */}
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                project.archived
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Duration
            </p>
            <p
              className={`font-semibold ${
                project.archived
                  ? "text-gray-600 dark:text-gray-500"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {formatDuration(project.totalDuration)}
            </p>
          </div>

          {/* Team Members */}
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                project.archived
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Team Members
            </p>
            <p
              className={`font-semibold ${
                project.archived
                  ? "text-gray-600 dark:text-gray-500"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {project.teamMembers?.length || 0} active
            </p>

            {project.suspendedMembers?.length > 0 && (
              <p
                className={`text-xs ${
                  project.archived
                    ? "text-gray-500 dark:text-gray-500"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {project.suspendedMembers.length} suspended
              </p>
            )}
          </div>

          {/* Progress bar - Hidden if archived */}
          {!project.archived && (
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
          )}

          {/* Archived projects show different info */}
          {project.archived && (
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
                Manageable By
              </p>
              <p className="font-semibold text-gray-600 dark:text-gray-500">
                {project.managingUserId?.length || 1} {project.managingUserId?.length === 1 ? "Manager" : "Managers"}
              </p>
            </div>
          )}
        </div>

        {/* Created info */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p
            className={`text-xs ${
              project.archived
                ? "text-gray-400 dark:text-gray-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Created {project.createdAt ? formatDateTime(project.createdAt) : ""}
            {canManageProject && " • You have management permissions"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;