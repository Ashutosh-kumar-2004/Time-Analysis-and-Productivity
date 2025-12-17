import React from "react";
import { X, Calendar, Clock, Activity, Tag, CheckCircle2 } from "lucide-react";

const ViewTimeLogModal = ({ isOpen, onClose, entry }) => {
  if (!isOpen || !entry) return null;

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "0m";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#1e1e1e] shadow-2xl p-6 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Time Log Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatDate(entry.startTimestamp)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Task Info */}
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {entry.taskTitle || "Untitled Task"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                  {entry.category}
                </p>
              </div>
            </div>
          </div>

          {/* Time Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Clock size={14} /> Duration
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatDuration(entry.durationInMinutes)}
              </div>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Activity size={14} /> Focus Score
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {entry.focusScore}
                <span className="text-sm text-gray-500 font-normal">/5</span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="flex items-center justify-between text-sm py-3 border-t border-b border-gray-100 dark:border-white/5">
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                Started
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatTime(entry.startTimestamp)}
              </span>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-white/10"></div>
            <div className="flex flex-col text-right">
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                Ended
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatTime(entry.endTimestamp)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {entry.additionalNotes && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Notes
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
                {entry.additionalNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewTimeLogModal;
