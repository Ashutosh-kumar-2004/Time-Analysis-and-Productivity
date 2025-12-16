// todo -> work on the add modal for the user for a project also, soft delete feature for the user

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaTimes,
  FaCheck,
  FaTrash,
  FaUserPlus,
  FaPlus,
  FaTasks,
  FaChartBar,
} from "react-icons/fa";
import { ThemeContext } from "../../../context/ThemeContext";
import { ProjectContext } from "../../../context/project/ProjectContext";
import { formatDateTime } from "../../../constants";
import CreateTaskModal from "../task/CreateTaskModal";
import TaskModalDetails from "../task/TaskModalDetails";
import ProjectDetailsShimmer from "./ProjectDetailsShimmer";
import TeamMembers from "./TeamMembers";
import TaskList from "./TaskList";
import EditProjectModal from "./EditProjectModal";

const ProjectDetailsPage = () => {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const { project, loading, setProject } = useContext(ProjectContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSubTaskModal, setShowSubTaskModal] = useState(false);



  if (loading && !project) return <ProjectDetailsShimmer />;

  if (!project)
    return (
      <div className="text-center mt-24 text-gray-500 dark:text-gray-400">
        Project not found
      </div>
    );
  const handleDeleteTask = (_taskId) => {
    // setProject((prevProject) => ({
    //   ...prevProject,
    //   tasks: prevProject.tasks.filter((t) => t._id !== taskId),
    // }));
    // Optionally call API to delete from backend
  };



  const handleCreateTask = (newTask) => {
    setProject((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
    setSelectedTask(newTask);
    setShowTaskModal(false);
  };

  const getStatusColor = (status) => {
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

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-300 border border-green-400 dark:border-green-700";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-300 border border-yellow-400 dark:border-yellow-700";
      case "high":
        return "bg-orange-200 dark:bg-orange-950 text-orange-900 dark:text-orange-300 border border-orange-500 dark:border-orange-700";
      case "critical":
        return "bg-red-200 dark:bg-red-950 text-red-900 dark:text-red-300 border border-red-600 dark:border-red-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600";
    }
  };

  const calculateProjectProgress = () => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(
      (task) => task.status === "completed"
    ).length;
    return (completedTasks / project.tasks.length) * 100;
  };

  const progress = calculateProjectProgress();
  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-gray-950" : "bg-blue-50"
      } transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/projects")}
          className="mb-6 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <FaArrowLeft /> Back to Projects
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                    {project.name}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status || "Started"}
                    </span>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(
                        project.priority
                      )}`}
                    >
                      {project.priority || "Medium"} Priority
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Created{" "}
                      {project.createdAt
                        ? formatDateTime(project.createdAt)
                        : "N/A"}
                    </span>
                  </div>
                </div>
                {/* Only show edit button if user is manager */}
                   <button
                    onClick={() => navigate(`/project-details/${project._id}/analysis`)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-300 mr-3"
                  >
                     <FaChartBar /> Analysis
                  </button>
                  {project.managingUserId?.some(u => u._id === project.currentUserId) && (
                   <button
                    onClick={() => setShowEditModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                     <FaEdit /> Edit Project
                  </button>
                  )}
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Description
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {project.description || "No description provided"}
                </p>
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-900 dark:text-white">
                    Project Progress
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-600 dark:bg-blue-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>


            </div>

            {/* Task Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tasks
                </h2>
                <button
                  onClick={() => {
                    setShowTaskModal(true);
                    setSelectedTask(null);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <FaPlus /> Create Task
                </button>
              </div>

              {/* Task list */}
              {project.tasks && project.tasks.length > 0 ? (
                <>
                  <TaskList />
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FaTasks className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No tasks yet. Create your first task!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Project Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Project Manager
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.projectStartedBy
                      ? `${project.projectStartedBy.firstName} ${project.projectStartedBy.lastName}`
                      : "Not assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Start Date
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.startDate
                      ? formatDateTime(project.startDate)
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    End Date
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.endDate
                      ? formatDateTime(project.endDate)
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Duration
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.totalDuration
                      ? `${Math.floor(project.totalDuration / 60)} hours`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Tasks
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.tasks?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <TeamMembers />
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <CreateTaskModal
          task={selectedTask}
          onCreate={handleCreateTask}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
        />
      )}

      {/* Task Details Modal */}
      {showSubTaskModal && selectedTask && (
        <TaskModalDetails
          isOpen={showSubTaskModal}
          task={selectedTask}
          onClose={() => {
            setShowSubTaskModal(false);
            setSelectedTask(null);
          }}
          onUpdateTask={(updatedTask) => {
            setProject((prev) => ({
              ...prev,
              tasks: prev.tasks.map((t) =>
                t._id === updatedTask._id ? updatedTask : t
              ),
            }));
            setSelectedTask(updatedTask);
          }}
        />
      )}

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        project={project}
      />
    </div>
  );
};

export default ProjectDetailsPage;
