import React from "react";
import { Target, Calendar, Plus } from "lucide-react";
import useFetchGoals from "../../../hooks/personalAnalysis/useFetchGoals";

const Goals = () => {
  const { goals, loading } = useFetchGoals();

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 w-full lg:flex-1 min-h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 w-full lg:flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Goals
        </h2>
        <button className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors flex items-center gap-1">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      <div className="space-y-6">
        {goals.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No active goals found.
          </div>
        ) : (
          goals.map((goal) => (
            <div
              key={goal._id}
              className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg leading-tight mb-1">
                    {goal.goalTitle}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {goal.goalDescription}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 capitalize">
                  {goal.goalType?.replace("_", " ")}
                </span>
              </div>

              <div className="flex justify-between text-sm mb-1.5 mt-4">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  Progress
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  {Math.round(goal.progressData.completionPercentage)}%
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${goal.progressData.completionPercentage}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Due {new Date(goal.goalPeriod.endDate).toLocaleDateString()}
                  </span>
                </div>
                <button className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors">
                  Update Progress
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Goals;
