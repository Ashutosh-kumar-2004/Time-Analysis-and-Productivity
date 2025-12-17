import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Activity,
  Smile,
  Gauge,
  Eye,
  Edit2,
  Filter,
} from "lucide-react";
import useDailyCheckIn from "../../../hooks/personalAnalysis/useDailyCheckIn";

const DailyLogView = ({ onClose, onEdit, onView }) => {
  const { fetchCheckInHistory, loading } = useDailyCheckIn();
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const loadHistory = async () => {
      const data = await fetchCheckInHistory(page, 7, filters);
      if (data) {
        setHistory(data.data);
        setTotalPages(data.meta.pages);
      }
    };
    loadHistory();
  }, [page, filters, fetchCheckInHistory]);

  // Reset page when filters change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getMoodColor = (level) => {
    if (level >= 4) return "text-green-500";
    if (level === 3) return "text-blue-500";
    return "text-orange-500";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Filter Header */}
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">
          Activity Log
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-colors ${
            showFilters
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
              : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500"
          }`}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 animate-in slide-in-from-top-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">From</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">To</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {loading && history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No logs found.</div>
        ) : (
          history.map((log) => (
            <div
              key={log._id}
              className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-all group relative"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {formatDate(log.date)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4 bg-white dark:bg-[#1e1e1e] shadow-sm rounded-lg p-1 border border-gray-100 dark:border-white/10">
                  <button
                    onClick={() => onView(log)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(log.date)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    title="Edit Log"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-sm mb-3">
                <div className="flex items-center gap-1.5" title="Energy">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {log.energyLevel}/5
                  </span>
                </div>
                <div className="flex items-center gap-1.5" title="Mood">
                  <Smile
                    className={`w-3.5 h-3.5 ${getMoodColor(log.moodLevel)}`}
                  />
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {log.moodLevel}/5
                  </span>
                </div>
                <div className="flex items-center gap-1.5" title="Stress">
                  <Gauge className="w-3.5 h-3.5 text-red-400" />
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {log.stressLevel}/5
                  </span>
                </div>
              </div>

              {/* Priorities */}
              {log.priorities && log.priorities.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Priorities
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-0.5">
                    {log.priorities.slice(0, 3).map((p, i) => (
                      <li key={i} className="truncate">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Motivation */}
              {log.motivation && (
                <div className="text-sm italic text-gray-500 dark:text-gray-400 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                  "
                  {log.motivation.length > 60
                    ? log.motivation.substring(0, 60) + "..."
                    : log.motivation}
                  "
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/10 mt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyLogView;
