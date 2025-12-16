import React, { useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { ThemeContext } from "../../../context/ThemeContext";
import { ProjectContext } from "../../../context/project/ProjectContext";
import { useAddSubtask } from "../../../hooks/projects/task/useAddSubtask";
import { FaPlus, FaSpinner } from "react-icons/fa";

const AddSubtask = ({ isOpen, onClose, parentTaskId }) => {
  const { isDark } = useContext(ThemeContext);
  const { project } = useContext(ProjectContext);
  const { addSubtask, loading } = useAddSubtask();

  const [formData, setFormData] = useState({
    title: "",
    estimatedHours: 0,
    assignedTo: "",
    description: "",
  });

  if (!isOpen || !parentTaskId) return null;

  // Get project team members for assignee dropdown
  const managers = project?.managingUserId || [];
  const team = project?.teamMembers || [];
  
  const allMembers = [...managers, ...team].filter(
    (member, index, self) =>
      index === self.findIndex((m) => (m._id || m) === (member._id || member))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSubtask(parentTaskId, formData);
      // Reset form
      setFormData({
        title: "",
        estimatedHours: 0,
        assignedTo: "",
        description: "",
      });
      onClose();
    } catch (error) {
      // Error handled in hook (logged)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <h2
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Add New Subtask
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                placeholder="Subtask title"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                } focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none`}
                placeholder="Optional description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Estimated Hours
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Assign To
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                >
                  <option value="">Unassigned</option>
                  {allMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                       {member.firstName} {member.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                Add Subtask
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubtask;
