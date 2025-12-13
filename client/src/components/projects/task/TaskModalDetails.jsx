import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const TaskModalDetails = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-200 hover:text-red-500"
          onClick={onClose}
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Task Details */}
        <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
        <p className="mb-2"><strong>Description:</strong> {task.description}</p>
        <p className="mb-2"><strong>Status:</strong> {task.status}</p>
        <p className="mb-2"><strong>Priority:</strong> {task.priority}</p>
        <p className="mb-2"><strong>Assigned To:</strong> {task.assignedTo?.firstName || "Unassigned"}</p>
        <p className="mb-4"><strong>Estimated Hours:</strong> {task.estimatedHours} | <strong>Logged Hours:</strong> {task.loggedHours}</p>

        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Subtasks:</h3>
            <div className="space-y-2">
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask._id}
                  className="bg-gray-100 dark:bg-gray-700 rounded p-2 border border-gray-300 dark:border-gray-600"
                >
                  <p><strong>{subtask.title}</strong> - Status: {subtask.status}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estimated: {subtask.estimatedHours} | Logged: {subtask.loggedHours}</p>
                  {subtask.workNotes && <p className="text-sm mt-1">{subtask.workNotes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModalDetails;
