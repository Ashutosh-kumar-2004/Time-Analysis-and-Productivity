import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  MoreVertical,
  Pencil,
  Trash2,
  List,
  Plus,
  Square,
  Eye,
} from "lucide-react";
import useTaskActions from "../../../hooks/personalAnalysis/useTaskActions";
import CreateTaskModal from "./CreateTaskModal";
import TaskCompletionModal from "./TaskCompletionModal";
import ViewTaskModal from "./ViewTaskModal";
import AllTasksModal from "./AllTasksModal";
import useDeletePersonalTask from "../../../hooks/personalAnalysis/useDeletePersonalTask";
import { usePersonalAnalysis } from "../../../context/personalAnalysis/PersonalAnalysisContext";

const ActiveTasks = () => {
  // Fetch 'in_progress' and 'not_started' from Context
  // Fetch 'in_progress' and 'not_started' from Context
  const { tasks, loading, error, refreshTasks, activeTimeEntry } =
    usePersonalAnalysis();
  const {
    startTrackingList,
    stopTrackingList,
    loading: actionLoading,
  } = useTaskActions();
  const { deleteTask, loading: deleteLoading } = useDeletePersonalTask();

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // State for completion modal
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState(null);

  // State for view modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [taskToView, setTaskToView] = useState(null);

  // State for all tasks modal
  const [isAllTasksModalOpen, setIsAllTasksModalOpen] = useState(false);

  const handleMarkComplete = (task) => {
    setTaskToComplete(task);
    setIsCompletionModalOpen(true);
  };

  const handleStartTracking = async (taskId) => {
    const result = await startTrackingList(taskId);
    if (result) {
      refreshTasks(); // This will refresh tasks and active entry
    }
  };

  const handleStopTracking = async (entryId) => {
    const result = await stopTrackingList(entryId);
    if (result) {
      refreshTasks();
    }
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (task) => {
    setTaskToView(task);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const success = await deleteTask(taskId);
      if (success) {
        refreshTasks();
      }
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setTaskToEdit(null);
    // Context handles refresh if update was successful via Modal
  };

  const handleCompletionClose = () => {
    setIsCompletionModalOpen(false);
    setTaskToComplete(null);
  };

  const handleViewClose = () => {
    setIsViewModalOpen(false);
    setTaskToView(null);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex-1 w-full flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex-1 w-full text-center text-red-500">
        Failed to load tasks.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex-1 w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
              Active Tasks
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tasks in progress
            </p>
          </div>
          <button
            onClick={() => setIsAllTasksModalOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
            title="View All Tasks"
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          {tasks.filter((t) => t.status !== "completed").length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No active tasks found.
              </p>
              <button
                onClick={() => {
                  setTaskToEdit(null);
                  setIsEditModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          ) : (
            tasks
              .filter((t) => t.status !== "completed") // Only show non-completed in the main list
              .map((task) => (
                <div
                  key={task.id}
                  className="group p-4 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            task.priority === "critical"
                              ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                              : task.priority === "high"
                              ? "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                              : task.priority === "medium"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400"
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 px-2 py-0.5 bg-white dark:bg-black/30 rounded border border-gray-100 dark:border-white/5">
                          {task.category?.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewClick(task)}
                          className="text-left font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors hover:underline"
                        >
                          {task.title}
                        </button>

                        {/* Action Icons group */}
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                          <button
                            onClick={() => handleViewClick(task)}
                            className="p-1 text-gray-400 hover:text-blue-500 transition-all"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditClick(task)}
                            className="p-1 text-gray-400 hover:text-amber-500 transition-all"
                            title="Edit Task"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(task.id)}
                            disabled={deleteLoading}
                            className="p-1 text-gray-400 hover:text-red-500 transition-all"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {activeTimeEntry && activeTimeEntry.task?.id === task.id ? (
                      <button
                        onClick={() => handleStopTracking(activeTimeEntry.id)}
                        className="opacity-100 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-red-500/30 cursor-pointer animate-pulse"
                        title="Stop Timer"
                      >
                        <Square className="w-4 h-4 fill-current" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartTracking(task.id)}
                        disabled={!!activeTimeEntry}
                        className={`opacity-0 group-hover:opacity-100 p-2 ${
                          activeTimeEntry
                            ? "bg-gray-300 cursor-not-allowed dark:bg-gray-700"
                            : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 hover:scale-105"
                        } text-white rounded-lg transition-all shadow-lg cursor-pointer`}
                        title={
                          activeTimeEntry
                            ? "Another active task running"
                            : "Start Timer"
                        }
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500 dark:text-gray-400">
                        Progress
                      </span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {task.completionPercentage || 0}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${task.completionPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200 dark:border-white/5">
                    <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {task.actualDuration || 0}m / {task.estimatedDuration}
                          m
                        </span>
                      </div>
                      {task.deadline && (
                        <div
                          className={`flex items-center gap-1.5 ${
                            task.isOverdue ? "text-red-500" : ""
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>
                            {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMarkComplete(task)}
                        disabled={actionLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Complete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* All Tasks Modal */}
      <AllTasksModal
        isOpen={isAllTasksModalOpen}
        onClose={() => setIsAllTasksModalOpen(false)}
        tasks={tasks}
        onView={handleViewClick}
        onEdit={handleEditClick}
        onStartTracking={handleStartTracking}
        onStopTracking={handleStopTracking}
        onComplete={handleMarkComplete}
        activeTimeEntry={activeTimeEntry}
      />

      {/* reusing CreateTaskModal for Editing */}
      <CreateTaskModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        taskToEdit={taskToEdit}
      />

      {/* Task Completion Modal */}
      <TaskCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={handleCompletionClose}
        task={taskToComplete}
      />

      {/* View Task Modal */}
      <ViewTaskModal
        isOpen={isViewModalOpen}
        onClose={handleViewClose}
        task={taskToView}
      />
    </>
  );
};

export default ActiveTasks;
