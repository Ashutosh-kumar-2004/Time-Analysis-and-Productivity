import React, { useState, useEffect } from "react";
import { List, Calendar, Pencil } from "lucide-react";
import useCreatePersonalTask from "../../../hooks/personalAnalysis/useCreatePersonalTask";
import useUpdatePersonalTask from "../../../hooks/personalAnalysis/useUpdatePersonalTask";
import { usePersonalAnalysis } from "../../../context/personalAnalysis/PersonalAnalysisContext";

const CreateTaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
  const { createTask, loading: createLoading } = useCreatePersonalTask();
  const { updateTask, loading: updateLoading } = useUpdatePersonalTask();
  const { refreshTasks } = usePersonalAnalysis();

  // Determine mode based on taskToEdit
  const isEditMode = !!taskToEdit;
  const loading = createLoading || updateLoading;

  const [formData, setFormData] = useState({
    taskTitle: "",
    taskDescription: "",
    category: "academic_studies",
    priorityLevel: "medium",
    estimatedDurationInMinutes: 60,
    deadlineDate: "",
    tags: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        // Populate form for editing
        setFormData({
          taskTitle: taskToEdit.title || "",
          taskDescription: taskToEdit.description || "",
          category: taskToEdit.category || "academic_studies",
          priorityLevel: taskToEdit.priority || "medium",
          estimatedDurationInMinutes: taskToEdit.estimatedDuration || 60,
          deadlineDate: taskToEdit.deadline
            ? new Date(taskToEdit.deadline).toISOString().slice(0, 16)
            : "",
          tags: taskToEdit.tags ? taskToEdit.tags.join(", ") : "",
        });
      } else {
        // Reset for creation
        setFormData({
          taskTitle: "",
          taskDescription: "",
          category: "academic_studies",
          priorityLevel: "medium",
          estimatedDurationInMinutes: 60,
          deadlineDate: "",
          tags: "",
        });
      }
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.taskTitle) return;

    const taskData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      deadlineDate: formData.deadlineDate || null,
    };

    let success = false;
    if (isEditMode) {
      success = await updateTask(taskToEdit.id, taskData);
    } else {
      success = await createTask(taskData);
    }

    if (success !== false) {
      // Assuming hooks return generic success indicator or promise resolves
      // Hooks handle toasts
      refreshTasks(); // Refresh the context data
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 dark:border-white/10 p-8 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-600 dark:text-blue-400">
            {isEditMode ? (
              <Pencil className="w-8 h-8" />
            ) : (
              <List className="w-8 h-8" />
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
          {isEditMode ? "Edit Task" : "Create New Task"}
        </h2>
        <div className="text-center mb-8">
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            name="taskTitle"
            value={formData.taskTitle}
            onChange={handleChange}
            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g., Complete Calculus Assignment"
          />
        </div>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleChange}
              rows="3"
              className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="What needs to be done?"
            ></textarea>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="academic_studies">Academic Studies</option>
                <option value="project_development">Project Development</option>
                <option value="personal">Personal</option>
                <option value="assignment_work">Assignment Work</option>
                <option value="exam_preparation">Exam Preparation</option>
                <option value="research_work">Research Work</option>
                <option value="skill_learning">Skill Learning</option>
                <option value="personal_development">
                  Personal Development
                </option>
                <option value="health_fitness">Health & Fitness</option>
                <option value="social_activities">Social Activities</option>
                <option value="administrative">Administrative</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority *
              </label>
              <select
                name="priorityLevel"
                value={formData.priorityLevel}
                onChange={handleChange}
                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Time & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                name="estimatedDurationInMinutes"
                value={formData.estimatedDurationInMinutes}
                onChange={handleChange}
                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deadline
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  name="deadlineDate"
                  value={formData.deadlineDate}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <Calendar className="absolute right-4 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma separated)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., math, urgent, project"
                className="flex-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Task"
              : "Create Task"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
