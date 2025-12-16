import React, { useEffect, useState, useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import { ProjectContext } from "../../../context/project/ProjectContext";
import { useUpdateTask } from "../../../hooks/projects/task/useUpdateTask";
import { useUpdateTaskStatus } from "../../../hooks/projects/task/useUpdateTaskStatus";

const EditTask = ({ isOpen, onClose, taskIdToEdit }) => {
  const { project, setProject } = useContext(ProjectContext);
  const selectedTask = project?.tasks?.find((t) => t._id === taskIdToEdit);
  const { updateTask, loading: updatingTask } = useUpdateTask();
  const { updateTaskStatus, loading: updatingStatus } = useUpdateTaskStatus();

  // If modal closed OR no task selected → render nothing
  if (!isOpen || !selectedTask) return null;

  // UI-only local state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    estimatedHours: 0,
    loggedHours: 0,
    status: "todo",
    workDescription: "",
  });

  // 🔥 Populate form when selectedTask changes
  useEffect(() => {
    if (selectedTask) {
      setFormData({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        priority: selectedTask.priority || "medium",
        estimatedHours: selectedTask.estimatedHours || 0,
        loggedHours: selectedTask.loggedHours || 0,
        status: selectedTask.status || "todo",
        workDescription: selectedTask.workDescription || "",
      });
    }
  }, [selectedTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedTask) return;

    // check if ONLY status changed
    const isStatusOnlyChange =
      formData.status !== selectedTask.status &&
      Object.keys(formData).every(
        (key) => key === "status" || formData[key] === selectedTask[key]
      );

    try {
      if (isStatusOnlyChange) {
        await updateTaskStatus(selectedTask._id, formData.status);
      } else {
        await updateTask(selectedTask._id, formData);
      }

      onClose();
    } catch (err) {
      // error already handled in hooks
      console.error("Save failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Glassy Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl mx-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500"
          >
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {(() => {
              const currentUserId = String(project?.currentUserId);
              const isProjectCreator = String(project?.projectStartedBy?._id || project?.projectStartedBy) === currentUserId;
              const isManager = project?.managingUserId?.some((u) => String(u._id || u) === currentUserId);
              const isTaskCreator = String(selectedTask.createdBy?._id || selectedTask.createdBy) === currentUserId;
              const isAssigned = String(selectedTask.assignedTo?._id || selectedTask.assignedTo) === currentUserId;
              
              const canUpdate = isProjectCreator || isManager || isTaskCreator || isAssigned;

              return (
                <>
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={!canUpdate}
              className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={!canUpdate}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={!canUpdate}
                className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={!canUpdate}
                className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                disabled={!canUpdate}
                className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Logged Hours
              </label>
              <input
                type="number"
                name="loggedHours"
                value={formData.loggedHours}
                onChange={handleChange}
                disabled={!canUpdate}
                className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Work Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Work Description / Notes
            </label>
            <textarea
              name="workDescription"
              value={formData.workDescription}
              onChange={handleChange}
              disabled={!canUpdate}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t dark:border-gray-700 mt-6 -mx-6 -mb-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {canUpdate ? "Cancel" : "Close"}
          </button>
          
          {canUpdate && (
          <button
            onClick={handleSave}
            disabled={updatingTask || updatingStatus}
            className={`px-5 py-2 rounded-lg flex items-center gap-2 text-white
    ${
      updatingTask || updatingStatus
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }
  `}
          >
            <FaSave />
            {updatingTask || updatingStatus ? "Saving..." : "Save Changes"}
          </button>
          )}
        </div>
        </>
        );
      })()}
        </div>
      </div>
    </div>
  );
};

export default EditTask;
