import React from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  MoreVertical,
} from "lucide-react";
import useFetchPersonalTasks from "../../../hooks/personalAnalysis/useFetchPersonalTasks.jsx";
import useTaskActions from "../../../hooks/personalAnalysis/useTaskActions";

const ActiveTasks = () => {
  // Fetch 'in_progress' and 'not_started' to show active tasks.
  // Assuming backend defaults or we filter. Recent changes added backend routes.
  const { tasks, loading, error, refetch } = useFetchPersonalTasks();

  const {
    updateTaskStatus,
    startTrackingList,
    loading: actionLoading,
  } = useTaskActions();

  const handleMarkComplete = async (taskId) => {
    const success = await updateTaskStatus(taskId, "completed");
    if (success) {
      refetch(); // Refresh list to remove completed task
    }
  };

  const handleStartTracking = async (taskId) => {
    await startTrackingList(taskId);
    // Maybe redirect to a 'timer' view or just update UI associated with active tracking?
    // For now, toast notification is enough as per hook.
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
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No active tasks found.
          </div>
        ) : (
          tasks.map((task) => (
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
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {task.title}
                  </h3>
                </div>
                <button
                  onClick={() => handleStartTracking(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30 cursor-pointer"
                  title="Start Timer"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
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
                      {task.actualDuration || 0}m / {task.estimatedDuration}m
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
                    onClick={() => handleMarkComplete(task.id)}
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
  );
};

export default ActiveTasks;
