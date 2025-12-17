import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Activity,
  Smile,
  Gauge,
} from "lucide-react";
import useDailyCheckIn from "../../../hooks/personalAnalysis/useDailyCheckIn";

const DailyLogView = ({ onClose }) => {
  const { fetchCheckInHistory, loading } = useDailyCheckIn();
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await fetchCheckInHistory(page);
      if (data) {
        setHistory(data.data);
        setTotalPages(data.meta.pages);
      }
    };
    loadHistory();
  }, [page, fetchCheckInHistory]);

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
              className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {formatDate(log.date)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1" title="Energy">
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {log.energyLevel}/5
                    </span>
                  </div>
                  <div className="flex items-center gap-1" title="Mood">
                    <Smile
                      className={`w-3.5 h-3.5 ${getMoodColor(log.moodLevel)}`}
                    />
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {log.moodLevel}/5
                    </span>
                  </div>
                  <div className="flex items-center gap-1" title="Stress">
                    <Gauge className="w-3.5 h-3.5 text-red-400" />
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {log.stressLevel}/5
                    </span>
                  </div>
                </div>
              </div>

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
