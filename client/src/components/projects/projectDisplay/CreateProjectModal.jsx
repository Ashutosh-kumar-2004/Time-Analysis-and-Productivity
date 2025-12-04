import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProject } from "../../../redux/projects/projectThunks";

const CreateProjectModal = ({ open, onClose }) => {
  if (!open) return null;

  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Started",
    priority: "medium",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({
        ...form,
        tags: [...form.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm({
      ...form,
      tags: form.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = () => {
    // Basic validation
    if (!form.name.trim()) {
      alert("Project name is required");
      return;
    }

    if (!form.startDate || !form.endDate) {
      alert("Start and end dates are required");
      return;
    }

    if (new Date(form.endDate) <= new Date(form.startDate)) {
      alert("End date must be after start date");
      return;
    }

    dispatch(addProject(form));
    onClose();
  };

  // Calculate minimum end date (start date + 1 day)
  const getMinEndDate = () => {
    if (form.startDate) {
      const nextDay = new Date(form.startDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toISOString().split("T")[0];
    }
    return "";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      {/* Glassy background */}
      <div
        className="absolute inset-0 bg-linear-to-br from-blue-50/30 to-purple-50/30 dark:from-gray-900/70 dark:to-gray-800/70"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="relative bg-white/90 dark:bg-gray-800/90 w-full max-w-2xl mx-4 p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Project Name *
              </label>
              <input
                name="name"
                value={form.name}
                placeholder="Enter project name"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option
                  value="Started"
                  className="text-gray-900 dark:text-white"
                >
                  Started
                </option>
                <option
                  value="In Progress"
                  className="text-gray-900 dark:text-white"
                >
                  In Progress
                </option>
                <option
                  value="Completed"
                  className="text-gray-900 dark:text-white"
                >
                  Completed
                </option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${getPriorityColor(
                  form.priority
                )}`}
              >
                <option value="low" className="text-gray-900 dark:text-white">
                  Low
                </option>
                <option
                  value="medium"
                  className="text-gray-900 dark:text-white"
                >
                  Medium
                </option>
                <option value="high" className="text-gray-900 dark:text-white">
                  High
                </option>
                <option
                  value="critical"
                  className="text-gray-900 dark:text-white"
                >
                  Critical
                </option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                min={getMinEndDate()}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Display */}
        {form.tags.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Added Tags ({form.tags.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description (Full width) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            Project Description
          </label>
          <textarea
            name="description"
            value={form.description}
            placeholder="Describe your project..."
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Create Project
          </button>
        </div>

        {/* Required fields note */}
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          <span className="text-red-500">*</span> Required fields
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
