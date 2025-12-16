import React, { useContext, useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { ThemeContext } from "../../../context/ThemeContext";
import { ProjectContext } from "../../../context/project/ProjectContext";
import { useUpdateSubtask } from "../../../hooks/projects/task/useUpdateSubtask";
import { useLogSubtaskHours } from "../../../hooks/projects/task/useLogSubtaskHours";
import { useDeleteSubtask } from "../../../hooks/projects/task/useDeleteSubtask";
import { FaClock, FaEdit, FaSave, FaSpinner, FaTrash } from "react-icons/fa";

const EditSubtask = ({ isOpen, onClose, subtaskToEdit, parentTaskId }) => {
  const { isDark } = useContext(ThemeContext);
  const { project } = useContext(ProjectContext);
  const { updateSubtask, loading: updating } = useUpdateSubtask();
  const { logSubtaskHours, loading: logging } = useLogSubtaskHours();
  const { deleteSubtask, loading: deleting } = useDeleteSubtask();

  const [activeTab, setActiveTab] = useState("details"); // 'details' or 'time'

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    estimatedHours: 0,
    assignedTo: "",
    status: "todo",
  });

  const [logData, setLogData] = useState({
    hours: 0,
    notes: "",
  });

  // Initialize form data when subtask changes
  useEffect(() => {
    if (subtaskToEdit) {
      setFormData({
        title: subtaskToEdit.title || "",
        estimatedHours: subtaskToEdit.estimatedHours || 0,
        assignedTo: subtaskToEdit.assignedTo?._id || subtaskToEdit.assignedTo || "",
        status: subtaskToEdit.status || "todo",
      });
      // Reset log data
      setLogData({
        hours: 0,
        notes: "",
      });
      setActiveTab("details");
    }
  }, [subtaskToEdit]);

  if (!isOpen || !subtaskToEdit) return null;

  // Get project team members for assignee dropdown
  // Flatten all members (managing users + team members) and remove duplicates if any
  const managers = project?.managingUserId || [];
  const team = project?.teamMembers || [];
  
  // Combine and deduplicate by ID
  const allMembers = [...managers, ...team].filter(
    (member, index, self) =>
      index === self.findIndex((m) => (m._id || m) === (member._id || member))
  );

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogChange = (e) => {
    const { name, value } = e.target;
    setLogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSubtask(parentTaskId, subtaskToEdit._id, formData);
      onClose();
    } catch (error) {
      // Error is handled in hook (logged)
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      await logSubtaskHours(parentTaskId, subtaskToEdit._id, {
        hours: Number(logData.hours),
        notes: logData.notes,
      });
      onClose();
    } catch (error) {
      // Error is handled in hook
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this subtask? This action cannot be undone.")) {
      try {
        await deleteSubtask(parentTaskId, subtaskToEdit._id);
        onClose();
      } catch (error) {
        // Error handled in hook
      }
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
            Manage Subtask
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

        {/* Tabs */}
        <div className={`flex border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "details"
                ? `border-b-2 border-blue-500 ${isDark ? "text-blue-400" : "text-blue-600"}`
                : `${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FaEdit /> Update Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("time")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "time"
                ? `border-b-2 border-blue-500 ${isDark ? "text-blue-400" : "text-blue-600"}`
                : `${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FaClock /> Log Time
            </div>
          </button>
        </div>

        {/* Content */}
                <div className="p-6">
          {activeTab === "details" ? (
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {(() => {
                  const parentTask = project?.tasks?.find(t => t._id === parentTaskId);
                  const currentUserId = String(project?.currentUserId);
                  const isProjectCreator = String(project?.projectStartedBy?._id || project?.projectStartedBy) === currentUserId;
                  const isManager = project?.managingUserId?.some((u) => String(u._id || u) === currentUserId);
                  const isTaskCreator = parentTask && String(parentTask.createdBy?._id || parentTask.createdBy) === currentUserId;
                  const isAssigned = String(subtaskToEdit.assignedTo?._id || subtaskToEdit.assignedTo) === currentUserId;
                  
                  const canUpdate = isProjectCreator || isManager || isTaskCreator || isAssigned;

                  return (
                    <>
                    <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleDetailsChange}
                  disabled={!canUpdate}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-1 focus:ring-blue-500 outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
                  placeholder="Subtask title"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Estimated Hours
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleDetailsChange}
                  disabled={!canUpdate}
                  min="0"
                  step="0.5"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-1 focus:ring-blue-500 outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Assigned To
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleDetailsChange}
                  disabled={!canUpdate}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-1 focus:ring-blue-500 outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  <option value="">Unassigned</option>
                  {allMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                       {member.firstName} {member.lastName} ({member.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleDetailsChange}
                  disabled={!canUpdate}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-1 focus:ring-blue-500 outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              </>
                  );
              })()}

              <div className="pt-2 flex justify-between gap-3">
                {(() => {
                  const parentTask = project?.tasks?.find(t => t._id === parentTaskId);
                  const currentUserId = String(project?.currentUserId);
                  const isProjectCreator = String(project?.projectStartedBy?._id || project?.projectStartedBy) === currentUserId;
                  const isManager = project?.managingUserId?.some((u) => String(u._id || u) === currentUserId);
                  const isTaskCreator = parentTask && String(parentTask.createdBy?._id || parentTask.createdBy) === currentUserId;
                  const canDelete = isProjectCreator || isManager || isTaskCreator;

                  return canDelete ? (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className={`px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                       {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                       Delete
                    </button>
                  ) : <div></div>;
                })()}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      }`}
                    >
                      Cancel
                    </button>
                    {(() => {
                         const parentTask = project?.tasks?.find(t => t._id === parentTaskId);
                         const currentUserId = String(project?.currentUserId);
                         const isProjectCreator = String(project?.projectStartedBy?._id || project?.projectStartedBy) === currentUserId;
                         const isManager = project?.managingUserId?.some((u) => String(u._id || u) === currentUserId);
                         const isTaskCreator = parentTask && String(parentTask.createdBy?._id || parentTask.createdBy) === currentUserId;
                         const isAssigned = String(subtaskToEdit.assignedTo?._id || subtaskToEdit.assignedTo) === currentUserId;
                         
                         const canUpdate = isProjectCreator || isManager || isTaskCreator || isAssigned;
                         
                         return canUpdate && (
                            <button
                              type="submit"
                              disabled={updating}
                              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updating ? <FaSpinner className="animate-spin" /> : <FaSave />}
                              Save Changes
                            </button>
                         )
                    })()}
                  </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogSubmit} className="space-y-4">
              {(() => {
                  const parentTask = project?.tasks?.find(t => t._id === parentTaskId);
                  const currentUserId = String(project?.currentUserId);
                  const isProjectCreator = String(project?.projectStartedBy?._id || project?.projectStartedBy) === currentUserId;
                  const isManager = project?.managingUserId?.some((u) => String(u._id || u) === currentUserId);
                  const isTaskCreator = parentTask && String(parentTask.createdBy?._id || parentTask.createdBy) === currentUserId;
                  const isAssigned = String(subtaskToEdit.assignedTo?._id || subtaskToEdit.assignedTo) === currentUserId;
                  
                  const canLog = isProjectCreator || isManager || isTaskCreator || isAssigned;

                  return (
                    <>
              <div className={`p-3 rounded-lg text-sm mb-4 ${
                isDark ? "bg-blue-900/30 text-blue-300" : "bg-blue-50 text-blue-700"
              }`}>
                <p>Current logged hours: <strong>{subtaskToEdit.loggedHours || 0}h</strong></p>
              </div>

              {/* Work History Display */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Work History
                </label>
                <div className={`w-full px-3 py-2 rounded-lg border text-sm max-h-40 overflow-y-auto whitespace-pre-wrap ${
                    isDark
                      ? "bg-gray-700/50 border-gray-600 text-gray-300"
                      : "bg-gray-50 border-gray-200 text-gray-600"
                  }`}>
                  {subtaskToEdit.workNotes ? subtaskToEdit.workNotes : "No work history recorded yet."}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Add Hours
                </label>
                <input
                  type="number"
                  name="hours"
                  value={logData.hours}
                  onChange={handleLogChange}
                  disabled={!canLog}
                  min="0.1"
                  step="0.1"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-1 focus:ring-blue-500 outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Work Notes
                </label>
                <textarea
                  name="notes"
                  value={logData.notes}
                  onChange={handleLogChange}
                  disabled={!canLog}
                  rows="3"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed`}
                  placeholder="Describe your work..."
                />
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
                  disabled={logging || !canLog}
                  title={canLog ? "Log Time" : "You do not have permission to log time"}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {logging ? <FaSpinner className="animate-spin" /> : <FaClock />}
                  Log Time
                </button>
              </div>
                    </>
                  );
              })()}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditSubtask;
