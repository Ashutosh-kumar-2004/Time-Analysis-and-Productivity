import React from "react";
import {
  ArrowLeft,
  Calendar,
  Activity,
  Smile,
  Gauge,
  Target,
  Lightbulb,
} from "lucide-react";

const DailyLogDetails = ({ log, onClose }) => {
  if (!log) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMoodColor = (level) => {
    if (level >= 4) return "text-green-600 dark:text-green-400";
    if (level === 3) return "text-blue-600 dark:text-blue-400";
    return "text-orange-600 dark:text-orange-400";
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-white/10 shrink-0">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
            Log Details
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            {formatDate(log.date)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-8 pr-2">
        {/* Metrics Grid */}
        <section className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20 text-center">
            <div className="flex justify-center mb-2">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-blue-100">
              {log.energyLevel}/5
            </p>
            <p className="text-xs text-gray-500 dark:text-blue-300 uppercase font-medium">
              Energy
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/20 text-center">
            <div className="flex justify-center mb-2">
              <Smile className={`w-6 h-6 ${getMoodColor(log.moodLevel)}`} />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-purple-100">
              {log.moodLevel}/5
            </p>
            <p className="text-xs text-gray-500 dark:text-purple-300 uppercase font-medium">
              Mood
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/20 text-center">
            <div className="flex justify-center mb-2">
              <Gauge className="w-6 h-6 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-orange-100">
              {log.stressLevel}/5
            </p>
            <p className="text-xs text-gray-500 dark:text-orange-300 uppercase font-medium">
              Stress
            </p>
          </div>
        </section>

        {/* Priorities */}
        {log.priorities && log.priorities.length > 0 && (
          <section>
            <h4 className="flex items-center gap-2 font-medium text-gray-900 dark:text-white mb-3">
              <Target className="w-4 h-4 text-gray-500" />
              Top Priorities
            </h4>
            <ul className="space-y-2">
              {log.priorities.map((item, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-3 rounded-lg text-sm"
                >
                  <span className="text-xs font-bold text-gray-400">
                    #{i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Focus Areas */}
        {log.focusAreas && log.focusAreas.length > 0 && (
          <section>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Focus Areas
            </h4>
            <div className="flex flex-wrap gap-2">
              {log.focusAreas.map((area, i) => (
                <span
                  key={i}
                  className="bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-full text-sm text-gray-700 dark:text-gray-300"
                >
                  {area}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Motivation */}
        {log.motivation && (
          <section>
            <h4 className="flex items-center gap-2 font-medium text-gray-900 dark:text-white mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Motivation & Notes
            </h4>
            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/20 text-sm text-gray-700 dark:text-yellow-100 leading-relaxed italic">
              "{log.motivation}"
            </div>
          </section>
        )}
      </div>

      <div className="pt-4 mt-auto border-t border-gray-100 dark:border-white/10">
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors font-medium"
        >
          Close Details
        </button>
      </div>
    </div>
  );
};

export default DailyLogDetails;
