import React from "react";
import { Clock, CheckCircle, Phone, Code, Activity } from "lucide-react";
import useFetchRecentActivity from "../../../hooks/personalAnalysis/useFetchRecentActivity";

const RecentActivity = () => {
  const { activities, loading } = useFetchRecentActivity(5);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 w-full lg:flex-1 min-h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Helper to format duration
  const formatDuration = (minutes) => {
    if (!minutes) return "0m";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // Helper to format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getIconAndStyle = (category, focusScore) => {
    // Simple mapping based on category or focus
    if (category?.includes("academic") || category?.includes("study")) {
      return {
        icon: <Clock className="w-5 h-5 text-blue-500" />,
        bg: "bg-blue-100 dark:bg-blue-900/30",
        pill: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
      };
    }
    if (category?.includes("development") || category?.includes("coding")) {
      return {
        icon: <Code className="w-5 h-5 text-indigo-500" />,
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
        pill: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200",
      };
    }
    if (category?.includes("other") || focusScore < 3) {
      return {
        icon: <Activity className="w-5 h-5 text-orange-500" />,
        bg: "bg-orange-100 dark:bg-orange-900/30",
        pill: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200",
      };
    }
    return {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      pill: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
    };
  };

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 w-full lg:flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Recent Activity
        </h2>
        <button className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-6">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No recent activity
          </div>
        ) : (
          activities.map((item) => {
            const style = getIconAndStyle(item.category, item.focusScore);
            return (
              <div key={item.id} className="flex gap-4 items-start group">
                <div
                  className={`p-3 rounded-xl ${style.bg} flex-shrink-0 transition-transform group-hover:scale-110`}
                >
                  {style.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-gray-900 dark:text-gray-100 font-semibold truncate">
                      {item.taskTitle || "Untitled Task"}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${style.pill}`}
                    >
                      {formatDuration(item.durationInMinutes)} • Focus:{" "}
                      {item.focusScore}/5
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                    <span>
                      {formatTimeAgo(item.endTimestamp || item.startTimestamp)}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="capitalize">
                      {item.category?.replace("_", " ") || "Uncategorized"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
