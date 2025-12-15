import React, { useState } from "react";
import { AiOutlineClose, AiOutlineEdit } from "react-icons/ai";

const TaskModalDetails = ({ isOpen, onClose, task, onUpdateTask }) => {
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [subtaskEdits, setSubtaskEdits] = useState({});

  if (!isOpen || !task) return null;

  const isDark = document.documentElement.classList.contains("dark");

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "todo":
        return isDark ? "bg-red-700 text-white" : "bg-red-500 text-white";
      case "in-progress":
        return isDark ? "bg-yellow-600 text-white" : "bg-yellow-400 text-black";
      case "completed":
        return isDark ? "bg-green-600 text-white" : "bg-green-500 text-white";
      default:
        return isDark ? "bg-gray-700 text-white" : "bg-gray-300 text-black";
    }
  };

  const handleEditClick = (subtask) => {
    setEditingSubtaskId(subtask._id);
    setSubtaskEdits({
      loggedHours: subtask.loggedHours || 0,
      workNotes: subtask.workNotes || "",
      status: subtask.status || "todo",
    });
  };

  const handleSave = (subtask) => {
    const updatedSubtasks = task.subtasks.map((st) =>
      st._id === subtask._id ? { ...st, ...subtaskEdits } : st
    );

    const updatedTask = {
      ...task,
      subtasks: updatedSubtasks,
    };

    setEditingSubtaskId(null);

    if (onUpdateTask) {
      onUpdateTask(updatedTask);
    }
  };

  const handleCancel = () => setEditingSubtaskId(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-200 hover:text-red-500"
          onClick={onClose}
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Task Header */}
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {task.title}
        </h2>

        <div className="mb-4 text-gray-800 dark:text-gray-200">
          <p className="mb-2">
            <strong>Description:</strong> {task.description}
          </p>
          <p className="mb-2">
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded font-semibold ${getStatusColor(
                task.status
              )}`}
            >
              {task.status}
            </span>
          </p>
          <p className="mb-2">
            <strong>Priority:</strong>{" "}
            <span
              className={`px-2 py-1 rounded font-semibold ${
                task.priority.toLowerCase() === "critical"
                  ? isDark
                    ? "bg-red-800 text-white"
                    : "bg-red-600 text-white"
                  : isDark
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {task.priority}
            </span>
          </p>
          <p className="mb-2">
            <strong>Assigned To:</strong>{" "}
            {task.assignedTo?.firstName || "Unassigned"}
          </p>
          <p className="mb-2">
            <strong>Estimated Hours:</strong> {task.estimatedHours} |{" "}
            <strong>Logged Hours:</strong> {task.loggedHours}
          </p>
        </div>

        {/* Subtasks */}
        {task.subtasks?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Subtasks
            </h3>
            <div className="space-y-3">
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask._id}
                  className="bg-gray-200 dark:bg-gray-800 rounded-lg p-3 border border-gray-300 dark:border-gray-700 relative"
                >
                  {editingSubtaskId !== subtask._id ? (
                    <>
                      <p className="flex justify-between items-center font-semibold text-gray-900 dark:text-white">
                        {subtask.title}
                        <button
                          onClick={() => handleEditClick(subtask)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <AiOutlineEdit />
                        </button>
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        Status:{" "}
                        <span
                          className={`px-2 py-1 rounded font-semibold ${getStatusColor(
                            subtask.status
                          )}`}
                        >
                          {subtask.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Estimated: {subtask.estimatedHours} | Logged:{" "}
                        {subtask.loggedHours}
                      </p>
                      {subtask.workNotes && (
                        <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                          {subtask.workNotes}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2 text-gray-900 dark:text-gray-200">
                      <p className="font-semibold">{subtask.title}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="flex-1">
                          Logged Hours:
                          <input
                            type="number"
                            value={subtaskEdits.loggedHours}
                            onChange={(e) =>
                              setSubtaskEdits({
                                ...subtaskEdits,
                                loggedHours: Number(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 mt-1 rounded border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </label>
                        <label className="flex-1">
                          Status:
                          <select
                            value={subtaskEdits.status}
                            onChange={(e) =>
                              setSubtaskEdits({
                                ...subtaskEdits,
                                status: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 mt-1 rounded border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="todo">Todo</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </label>
                      </div>
                      <label className="block mt-1">
                        Work Notes:
                        <textarea
                          value={subtaskEdits.workNotes}
                          onChange={(e) =>
                            setSubtaskEdits({
                              ...subtaskEdits,
                              workNotes: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full px-2 py-1 mt-1 rounded border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </label>
                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          onClick={() => handleSave(subtask)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        {task.subtasks?.some((st) => st.comments?.length) && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Comments
            </h3>
            {task.subtasks.map((subtask) =>
              subtask.comments?.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 border border-gray-300 dark:border-gray-700 mb-2"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {comment.user?.firstName || comment.user}{" "}
                    {/* populated username */}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {comment.text}
                  </p>
                  {comment.replies?.map((reply) => (
                    <div
                      key={reply._id}
                      className="ml-4 mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded"
                    >
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {reply.user?.firstName || reply.user}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {reply.text}
                      </p>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModalDetails;
