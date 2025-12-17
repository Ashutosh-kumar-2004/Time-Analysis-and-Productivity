import React, { useState, useMemo } from "react";
import {
  X,
  Search,
  Filter,
  Calendar,
  Clock,
  Eye,
  Pencil,
  Play,
  Square,
} from "lucide-react";
import { CheckCircle2 } from "lucide-react";

const AllTasksModal = ({
  isOpen,
  onClose,
  tasks = [],
  onView,
  onEdit,
  onStartTracking,
  onStopTracking,
  onComplete,
  activeTimeEntry,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      // Priority
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      // Category
      const matchesCategory =
        categoryFilter === "all" || task.category === categoryFilter;

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesCategory
      );
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl w-full max-w-5xl h-[90vh] flex flex-col border border-gray-100 dark:border-white/10 overflow-hidden transform transition-all animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-[#1e1e1e] z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              All Tasks
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage and view all your tasks history
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 bg-gray-50 dark:bg-black/20 border-b border-gray-100 dark:border-white/5 flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="academic_studies">Academic Studies</option>
            <option value="project_development">Project Development</option>
            <option value="personal">Personal</option>
          </select>

          <div className="text-sm text-gray-500 dark:text-gray-400 ml-auto bg-white dark:bg-white/5 py-1 px-3 rounded-full border border-gray-200 dark:border-white/10">
            Showing {filteredTasks.length} tasks
          </div>
        </div>

        {/* Task List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-[#1e1e1e]">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>No tasks found matching filters.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group bg-white dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all flex items-center gap-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/5"
                onClick={() => onView(task)}
              >
                {/* Status Indicator */}
                <div
                  className={`w-1.5 self-stretch rounded-full ${
                    task.status === "completed"
                      ? "bg-green-500"
                      : task.status === "in_progress"
                      ? "bg-blue-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                ></div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {task.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        task.priority === "critical"
                          ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                          : task.priority === "high"
                          ? "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {task.actualDuration || 0}m / {task.estimatedDuration}m
                    </span>
                    {task.deadline && (
                      <span
                        className={`flex items-center gap-1 ${
                          task.isOverdue ? "text-red-500" : ""
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                    <span className="capitalize px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 rounded border border-gray-200 dark:border-white/5">
                      {task.status?.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Completion Bar */}
                <div className="w-24 hidden sm:block">
                  <div className="flex justify-between text-[10px] mb-1 text-gray-500">
                    <span>Progress</span>
                    <span>{task.completionPercentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        task.status === "completed"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${task.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(task);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                    }}
                    className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-all"
                    title="Edit Task"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {activeTimeEntry && activeTimeEntry.task?.id === task.id ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStopTracking(activeTimeEntry.id);
                      }}
                      className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all animate-pulse"
                      title="Stop Timer"
                    >
                      <Square className="w-4 h-4 fill-current" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartTracking(task.id);
                      }}
                      disabled={!!activeTimeEntry}
                      className={`p-2 rounded-lg transition-all ${
                        activeTimeEntry
                          ? "text-gray-300 cursor-not-allowed dark:text-gray-600"
                          : "text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10"
                      }`}
                      title={activeTimeEntry ? "Timer running" : "Start Timer"}
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  {task.status !== "completed" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onComplete(task);
                      }}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-600/10 rounded-lg transition-all"
                      title="Mark Complete"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTasksModal;
