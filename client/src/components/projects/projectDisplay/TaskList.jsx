import React, { useState, useContext } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaExclamationCircle,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaComment,
  FaTasks,
  FaCheckCircle,
  FaPlayCircle,
  FaPauseCircle,
} from "react-icons/fa";
import { ProjectContext } from "../../../context/project/ProjectContext";
import { ThemeContext } from "../../../context/ThemeContext";
import { getPriorityColor, getStatusColor } from "../../../constants/tasklist";
import { useDeleteTask } from "../../../hooks/projects/task/useDeleteTask";
import EditTask from "../task/EditTask";
import EditSubtask from "../task/EditSubtask";
import AddSubtask from "../task/AddSubtask";

const TaskList = () => {
  const { project, setProject } = useContext(ProjectContext);
  const { isDark } = useContext(ThemeContext);
  const tasks = project?.tasks || [];
  const { deleteTask, loading: deleting } = useDeleteTask();
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showEditSubtaskModal, setShowEditSubtaskModal] = useState(false);
  const [subtaskToEdit, setSubtaskToEdit] = useState(null);
  const [parentTaskId, setParentTaskId] = useState(null);
  const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);

  const [expandedTasks, setExpandedTasks] = useState({});

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // delete a task
  const handleDelete = async (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "in-progress":
        return <FaPlayCircle className="text-blue-500" />;
      case "todo":
        return <FaPauseCircle className="text-yellow-500" />;
      default:
        return <FaTasks className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const calculateProgress = (task) => {
    if (!task.subtasks || task.subtasks.length === 0) {
      return task.status === "completed" ? 100 : 0;
    }
    const completed = task.subtasks.filter(
      (st) => st.status === "completed"
    ).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDark
              ? "bg-gray-700/20"
              : "bg-linear-to-r from-blue-100 to-cyan-100"
          }`}
        >
          <FaTasks
            className={`w-10 h-10 ${isDark ? "text-white" : "text-blue-500"}`}
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Create your first task to get started
        </p>
        <button
          onClick={() => {
            /* open create task modal */
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-medium"
        >
          <FaPlus /> Create First Task
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task, index) => {
          const progress = calculateProgress(task);
          const isExpanded = expandedTasks[task._id];
          const currentUserId = String(project?.currentUserId);
          const isProjectCreator = String(project?.projectStartedBy?._id || project?.projectStartedBy) === currentUserId;
          const isManager = project?.managingUserId?.some((u) => String(u._id || u) === currentUserId);
          const isTaskCreator = String(task.createdBy?._id || task.createdBy) === currentUserId;
          const isTaskAssigned = String(task.assignedTo?._id || task.assignedTo) === currentUserId;
          
          const canEditTask = isProjectCreator || isManager || isTaskCreator || isTaskAssigned;
          const canAddSubtask = isProjectCreator || isManager || isTaskCreator;

          return (
            <div
              key={task._id || index}
              className={`rounded-xl border transition-all duration-300 hover:shadow-md ${
                isDark
                  ? "border-gray-700 bg-gray-800/50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Task Header */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => toggleTaskExpansion(task._id)}
                        className={`p-1 rounded transition-colors ${
                          isDark
                            ? "hover:bg-gray-700 text-gray-400"
                            : "hover:bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isExpanded ? (
                          <FaChevronUp className="w-4 h-4" />
                        ) : (
                          <FaChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                          {task.title}
                        </h3>
                      </div>

                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        <FaExclamationCircle className="inline mr-1" />
                        {task.priority}
                      </span>

                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status?.replace("-", " ") || "Todo"}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 ml-9">
                        {task.description}
                      </p>
                    )}

                    {/* Task Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm ml-9">
                      <span
                        className={`flex items-center gap-1 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <FaCalendarAlt className="w-4 h-4" />{" "}
                        {formatDate(task.dueDate)}
                      </span>

                      <span
                        className={`flex items-center gap-1 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <FaClock className="w-4 h-4" />{" "}
                        {task.estimatedHours || 0}h
                      </span>

                      {task.loggedHours > 0 && (
                        <span
                          className={`flex items-center gap-1 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <FaClock className="w-4 h-4" /> Logged:{" "}
                          {task.loggedHours}h
                        </span>
                      )}

                      {task.assignedTo && (
                        <span
                          className={`flex items-center gap-1 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <FaUser className="w-4 h-4" /> Assigned
                        </span>
                      )}

                      {task.subtasks && task.subtasks.length > 0 && (
                        <span
                          className={`flex items-center gap-1 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <FaTasks className="w-4 h-4" /> {task.subtasks.length}{" "}
                          subtasks
                        </span>
                      )}

                      {task.comments && task.comments.length > 0 && (
                        <span
                          className={`flex items-center gap-1 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <FaComment className="w-4 h-4" />{" "}
                          {task.comments.length} comments
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="mt-3 ml-9">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Subtask Progress
                          </span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {progress}%
                          </span>
                        </div>
                        <div
                          className={`w-full h-2 rounded-full ${
                            isDark ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className="h-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {canEditTask && (
                      <button
                        onClick={() => {
                          setTaskToEdit(task);
                          setShowEditTaskModal(true);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "hover:bg-gray-700 text-blue-400 hover:text-blue-300"
                            : "hover:bg-gray-100 text-blue-600 hover:text-blue-800"
                        }`}
                        title="Edit Task"
                      >
                        <FaEdit />
                      </button>
                    )}
                    {(() => {
                      const canDeleteTask = isProjectCreator || isManager;
                      
                      if(canDeleteTask) {
                          return (
                            <button
                              onClick={() => {
                                handleDelete(task._id);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                isDark
                                  ? "hover:bg-gray-700 text-white hover:text-red-400"
                                  : "hover:bg-gray-100 text-red-600 hover:text-red-800"
                              }`}
                              title="Delete Task"
                            >
                              <FaTrash />
                            </button>
                          )
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div
                  className={`px-4 pb-4 border-t ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="mt-4">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                        Tags:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}



                      {/* Subtasks */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block">
                        Subtasks:
                      </span>
                      {(() => {
                        return canAddSubtask && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setParentTaskId(task._id);
                              setShowAddSubtaskModal(true);
                            }}
                            className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <FaPlus /> Add New
                          </button>
                        );
                      })()}
                    </div>
                  
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-2">
                      <div className="space-y-2">
                        {task.subtasks.map((subtask, subIndex) => {
                          const isSubtaskAssignee = String(subtask.assignedTo?._id || subtask.assignedTo) === currentUserId;
                          const canEditSubtask = isProjectCreator || isManager || isTaskCreator || isSubtaskAssignee;

                          return (
                          <div
                            key={subtask._id || subIndex}
                            onClick={() => {
                              if (canEditSubtask) {
                                setSubtaskToEdit(subtask);
                                setParentTaskId(task._id);
                                setShowEditSubtaskModal(true);
                              }
                            }}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                              canEditSubtask ? "cursor-pointer" : "cursor-default"
                            } ${
                              isDark
                                ? "bg-gray-900/50 border-gray-800 hover:border-gray-600 hover:bg-gray-800"
                                : "bg-gray-50 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center ${
                                  subtask.status === "completed"
                                    ? "bg-green-500 border-green-500"
                                    : isDark
                                    ? "border-gray-600"
                                    : "border-gray-400"
                                }`}
                              >
                                {subtask.status === "completed" && (
                                  <FaCheckCircle className="text-white text-xs" />
                                )}
                              </div>
                              <div>
                                <span
                                  className={`text-sm ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  } ${
                                    subtask.status === "completed"
                                      ? "line-through opacity-60"
                                      : ""
                                  }`}
                                >
                                  {subtask.title}
                                </span>
                                {subtask.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {subtask.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {subtask.estimatedHours > 0 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {subtask.estimatedHours}h
                                </span>
                              )}
                              {subtask.loggedHours > 0 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  ({subtask.loggedHours}h logged)
                                </span>
                              )}
                            </div>
                          </div>
                        )})}
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showEditTaskModal && (
        <EditTask
          taskIdToEdit={taskToEdit._id}
          isOpen={showEditTaskModal}
          onClose={() => {
            setShowEditTaskModal(false);
            setTaskToEdit(null);
          }}
        />
      )}

      {showEditSubtaskModal && subtaskToEdit && (
        <EditSubtask
          isOpen={showEditSubtaskModal}
          onClose={() => {
            setShowEditSubtaskModal(false);
            setSubtaskToEdit(null);
            setParentTaskId(null);
          }}
          subtaskToEdit={subtaskToEdit}
          parentTaskId={parentTaskId}
        />
      )}

      {showAddSubtaskModal && parentTaskId && (
        <AddSubtask
          isOpen={showAddSubtaskModal}
          onClose={() => {
            setShowAddSubtaskModal(false);
            setParentTaskId(null);
          }}
          parentTaskId={parentTaskId}
        />
      )}
    </>
  );
};

export default TaskList;
