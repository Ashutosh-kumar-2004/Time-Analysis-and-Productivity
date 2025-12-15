import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaPlus,
  FaUser,
  FaCalendar,
  FaClock,
  FaTag,
  FaExclamationCircle,
} from "react-icons/fa";
import { ProjectContext } from "../../../context/project/ProjectContext";
import { useContext } from "react";
import { useCreateTask } from "../../../hooks/projects/task/useCreateTask";

const CreateTaskModal = ({
  activeMembers = [],
  currentUser,
  onSubmit,
  onCreate,
  onClose,
  isDark = false,
}) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
    estimatedHours: 0,
    labels: [],
  });

  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newSubtaskHours, setNewSubtaskHours] = useState("");
  const [newSubtaskAssignee, setNewSubtaskAssignee] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { project, loading } = useContext(ProjectContext);
  const { createTask, loading: creating, error } = useCreateTask();

  activeMembers = project.teamMembers;

  const availableLabels = [
    "bug",
    "feature",
    "design",
    "frontend",
    "backend",
    "urgent",
    "review",
  ];

  const priorityColors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  };

  // Initialize with project ID and suggested due date
  useEffect(() => {
    if (project?._id) {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      setTaskData((prev) => ({
        ...prev,
        projectId: project._id,
        dueDate: date.toISOString().split("T")[0],
      }));
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  const handleAddCustomLabel = () => {
    if (newLabel.trim() && !taskData.labels.includes(newLabel.trim())) {
      setTaskData((prev) => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()],
      }));
      setNewLabel("");
    }
  };

  const handleLabelToggle = (label) => {
    setTaskData((prev) => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter((l) => l !== label)
        : [...prev.labels, label],
    }));
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const subtaskToAdd = {
        title: newSubtaskTitle.trim(),
        estimatedHours: parseFloat(newSubtaskHours) || 0,
        assignedTo: newSubtaskAssignee || null,
      };
      setSubtasks([...subtasks, subtaskToAdd]);
      setNewSubtaskTitle("");
      setNewSubtaskHours("");
      setNewSubtaskAssignee("");
    }
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const calculateTotalSubtaskHours = () =>
    subtasks.reduce((total, s) => total + (s.estimatedHours || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) {
      alert("Task title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const taskToSubmit = {
        ...taskData,
        projectId: project?._id,
        createdBy: currentUser?._id,
        subtasks: subtasks.map((st, index) => ({
          title: st.title,
          estimatedHours: st.estimatedHours || 0,
          assignedTo: st.assignedTo,
          order: index,
        })),
        assignedTo:
          taskData.assignedTo ||
          (activeMembers.some((m) => m._id === currentUser?._id)
            ? currentUser?._id
            : ""),
      };
      const createdTask = await createTask(taskToSubmit);
      onCreate(createdTask); // <-- send to parent

      onClose();
    } catch (error) {
      console.error("Task creation failed", error);
      alert(error?.response?.data?.message || "Failed to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop with improved click handling */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 ${
          isDark
            ? "bg-gray-900 border border-gray-800"
            : "bg-white border border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click
      >
        {/* HEADER */}
        <div
          className={`sticky top-0 z-10 px-6 py-4 border-b ${
            isDark
              ? "bg-gray-900/95 border-gray-800 backdrop-blur-sm"
              : "bg-white/95 border-gray-200 backdrop-blur-sm"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Create New Task
              </h2>
              <p
                className={`text-sm mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Add a new task to "{project?.name || "Project"}"
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all hover:scale-105 ${
                isDark
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Close modal"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]"
        >
          {/* Title */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={`w-full px-4 py-3 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description
            </label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the task..."
              className={`w-full px-4 py-3 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
            />
          </div>

          {/* PRIORITY • DUE DATE • ASSIGNED TO • HOURS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div>
              <label
                className={`block text-sm font-medium mb-3 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Priority
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["low", "medium", "high", "critical"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setTaskData({ ...taskData, priority: level })
                    }
                    className={`py-3 text-sm font-medium rounded-lg transition-all transform hover:scale-[1.02] ${
                      taskData.priority === level
                        ? `${priorityColors[level]} text-white shadow-md`
                        : isDark
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <FaExclamationCircle
                      className={`inline mr-1 ${
                        taskData.priority === level
                          ? "opacity-80"
                          : "opacity-60"
                      }`}
                    />
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Due Date
              </label>
              <div className="relative">
                <FaCalendar
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="date"
                  name="dueDate"
                  value={taskData.dueDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Assign To
              </label>
              <div className="relative">
                <FaUser
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <select
                  name="assignedTo"
                  value={taskData.assignedTo}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Select assignee</option>
                  <option value="">Unassigned</option>
                  {activeMembers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.firstName} {m.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hours */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Estimated Hours
              </label>
              <div className="relative">
                <FaClock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="number"
                  name="estimatedHours"
                  value={taskData.estimatedHours}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  placeholder="0"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Labels */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Labels
              </label>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {taskData.labels.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {availableLabels.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleLabelToggle(label)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-[1.02] flex items-center gap-1 ${
                    taskData.labels.includes(label)
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : isDark
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaTag className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddCustomLabel)}
                placeholder="Add custom label"
                className={`flex-1 px-4 py-2 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />
              <button
                type="button"
                onClick={handleAddCustomLabel}
                disabled={!newLabel.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isDark
                    ? newLabel.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : newLabel.trim()
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Add
              </button>
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Subtasks
              </label>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {subtasks.length} added • Total: {calculateTotalSubtaskHours()}h
              </span>
            </div>

            {/* Subtask List */}
            {subtasks.length > 0 && (
              <div className="space-y-3 mb-4">
                {subtasks.map((subtask, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-md ${
                      isDark
                        ? "bg-gray-800/50 border border-gray-700"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {subtask.title}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        {subtask.estimatedHours > 0 && (
                          <span
                            className={`text-xs flex items-center gap-1 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <FaClock className="w-3 h-3" />
                            {subtask.estimatedHours}h
                          </span>
                        )}
                        {subtask.assignedTo && (
                          <span
                            className={`text-xs flex items-center gap-1 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <FaUser className="w-3 h-3" />
                            {activeMembers.find(
                              (m) => m._id === subtask.assignedTo
                            )?.firstName || "Assigned"}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(index)}
                      className={`p-2 rounded-lg transition-all hover:scale-110 ${
                        isDark
                          ? "text-red-400 hover:text-red-300 hover:bg-gray-700"
                          : "text-red-500 hover:text-red-600 hover:bg-gray-100"
                      }`}
                      aria-label="Remove subtask"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Subtask Form */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddSubtask)}
                placeholder="Subtask title"
                className={`flex-1 px-4 py-3 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />
              <div className="flex gap-3">
                <input
                  type="number"
                  value={newSubtaskHours}
                  onChange={(e) => setNewSubtaskHours(e.target.value)}
                  placeholder="Hours"
                  min="0"
                  step="0.5"
                  className={`w-24 px-4 py-3 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />
                <select
                  value={newSubtaskAssignee}
                  onChange={(e) => setNewSubtaskAssignee(e.target.value)}
                  className={`w-40 px-4 py-3 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">No assignee</option>
                  {activeMembers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.firstName} {m.lastName}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  disabled={!newSubtaskTitle.trim()}
                  className={`px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    isDark
                      ? newSubtaskTitle.trim()
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : newSubtaskTitle.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaPlus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 ${
                isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !taskData.title.trim()}
              className={`px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 ${
                creating
                  ? "bg-gray-500 cursor-not-allowed"
                  : isDark
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } ${
                !taskData.title.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {creating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
