import React, { useContext, useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const DetailedCategoryBreakdown = ({ data, loading }) => {
  const { isDark } = useContext(ThemeContext);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const categories = data || [];

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <FiChevronDown className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === "asc" ? (
      <FiChevronDown className="w-4 h-4" />
    ) : (
      <FiChevronUp className="w-4 h-4" />
    );
  };

  return (
    <div
      className={`rounded-xl p-6 ${
        isDark
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200"
      } shadow-sm`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Detailed Category Breakdown
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className={`border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <th
                className={`text-left py-3 px-4 font-semibold text-sm cursor-pointer hover:bg-opacity-50 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Category
                  <SortIcon columnKey="name" />
                </div>
              </th>
              <th
                className={`text-left py-3 px-4 font-semibold text-sm cursor-pointer hover:bg-opacity-50 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
                onClick={() => handleSort("totalTime")}
              >
                <div className="flex items-center gap-2">
                  Total Time
                  <SortIcon columnKey="totalTime" />
                </div>
              </th>
              <th
                className={`text-left py-3 px-4 font-semibold text-sm cursor-pointer hover:bg-opacity-50 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
                onClick={() => handleSort("sessions")}
              >
                <div className="flex items-center gap-2">
                  Sessions
                  <SortIcon columnKey="sessions" />
                </div>
              </th>
              <th
                className={`text-left py-3 px-4 font-semibold text-sm cursor-pointer hover:bg-opacity-50 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
                onClick={() => handleSort("avgDuration")}
              >
                <div className="flex items-center gap-2">
                  Avg Duration
                  <SortIcon columnKey="avgDuration" />
                </div>
              </th>
              <th
                className={`text-left py-3 px-4 font-semibold text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Percentage
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCategories.map((category, index) => (
              <tr
                key={index}
                className={`border-b transition-colors ${
                  isDark
                    ? "border-gray-700 hover:bg-gray-750"
                    : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {category.name}
                    </span>
                  </div>
                </td>
                <td
                  className={`py-4 px-4 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {category.totalTime}h
                </td>
                <td
                  className={`py-4 px-4 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {category.sessions}
                </td>
                <td
                  className={`py-4 px-4 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {category.avgDuration}h
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium min-w-[40px] ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {category.percentage}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedCategoryBreakdown;
