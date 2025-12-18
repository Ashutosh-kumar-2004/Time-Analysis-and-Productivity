import React, { useState, useContext, useEffect } from "react";
import { usePersonalAnalysis } from "../../../context/personalAnalysis/PersonalAnalysisContext";
import { ThemeContext } from "../../../context/ThemeContext";
import {
  FiCalendar,
  FiFilter,
  FiCheck,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import StatsCards from "./StatsCards";
import TimeAllocationChart from "./TimeAllocationChart";
import ProductivityTrendChart from "./ProductivityTrendChart";
import CategoryComparisonChart from "./CategoryComparisonChart";
import DetailedCategoryBreakdown from "./DetailedCategoryBreakdown";
import ExportAnalyticsReport from "./ExportAnalyticsReport";
import FocusTrends from "../formData/FocusTrends";

const PersonalAnalysisDashboard = () => {
  const { isDark } = useContext(ThemeContext);
  const { fetchDashboardStats, dashboardStats, statsLoading } =
    usePersonalAnalysis();
  const [activeTimeRange, setActiveTimeRange] = useState("This Week");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [minDuration, setMinDuration] = useState("");

  const timeRanges = [
    { id: "today", label: "Today", icon: FiCalendar },
    { id: "week", label: "This Week", icon: FiCalendar },
    { id: "month", label: "This Month", icon: FiCalendar },
    { id: "custom", label: "Custom Range", icon: FiCalendar },
  ];

  const categories = [
    "Development",
    "Meetings",
    "Learning",
    "Break",
    "Admin",
    "Creative",
  ];
  const tags = [
    "Urgent",
    "Important",
    "Low Priority",
    "Bug Fix",
    "Feature",
    "Documentation",
  ];
  const durations = [
    "Any duration",
    "< 30 min",
    "30-60 min",
    "1-2 hours",
    "> 2 hours",
  ];

  const handleApplyFilters = () => {
    console.log("Applying filters:", {
      selectedCategory,
      selectedTag,
      minDuration,
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedTag("");
    setMinDuration("");
  };

  useEffect(() => {
    fetchDashboardStats(activeTimeRange);
  }, [activeTimeRange, fetchDashboardStats]);

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Analytics Dashboard
          </h1>
          <p
            className={`text-base ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Comprehensive productivity insights and detailed reporting
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={dashboardStats?.stats} loading={statsLoading} />

        {/* Time Range Filters */}
        <div
          className={`rounded-xl p-6 mb-6 print:hidden ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          } shadow-sm`}
        >
          <div className="flex flex-wrap gap-3">
            {timeRanges.map((range) => {
              const Icon = range.icon;
              const isActive = activeTimeRange === range.label;

              return (
                <button
                  key={range.id}
                  onClick={() => setActiveTimeRange(range.label)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Filters */}
        <div
          className={`rounded-xl overflow-hidden print:hidden ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          } shadow-sm`}
        >
          {/* Filter Header */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full flex items-center justify-between p-6 transition-colors ${
              isDark ? "hover:bg-gray-750" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <FiFilter
                className={`w-5 h-5 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <span
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Advanced Filters
              </span>
            </div>
            <FiChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                showFilters ? "rotate-180" : ""
              } ${isDark ? "text-gray-400" : "text-gray-600"}`}
            />
          </button>

          {/* Filter Content */}
          {showFilters && (
            <div
              className={`px-6 pb-6 border-t ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Categories */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-3 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Categories
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none`}
                    >
                      <option value="">Select categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-3 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Tags
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none`}
                    >
                      <option value="">Select tags</option>
                      {tags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Minimum Duration */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-3 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Minimum Duration
                  </label>
                  <div className="relative">
                    <select
                      value={minDuration}
                      onChange={(e) => setMinDuration(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none`}
                    >
                      {durations.map((duration) => (
                        <option key={duration} value={duration}>
                          {duration}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleApplyFilters}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
                >
                  <FiCheck className="w-4 h-4" />
                  Apply Filters
                </button>
                <button
                  onClick={handleResetFilters}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                    isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FiX className="w-4 h-4" />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Charts Section */}
        {!statsLoading && !dashboardStats?.stats?.hasData ? (
          <div
            className={`mt-8 p-12 text-center rounded-xl border-2 border-dashed ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <div
              className={`text-xl font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              No Data Available for this Period
            </div>
            <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Start tracking your tasks or time entries to see analytics here.
            </p>
            {/* You could add a button here to open Log Time modal if you had the handler passed down */}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <TimeAllocationChart
                data={dashboardStats?.timeAllocation}
                loading={statsLoading}
              />
              <ProductivityTrendChart
                data={dashboardStats?.productivityTrend}
                loading={statsLoading}
              />
            </div>

            {/* Focus Trends and Category Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <FocusTrends data={dashboardStats?.focusTrends} />
              <CategoryComparisonChart
                data={dashboardStats?.categoryComparison}
                loading={statsLoading}
                rangeLabel={
                  activeTimeRange === "Today"
                    ? "Today vs Yesterday"
                    : activeTimeRange === "This Month"
                    ? "This Month vs Last Month"
                    : "This Week vs Last Week"
                }
              />
            </div>

            {/* Detailed Category Breakdown Table */}
            <div className="mt-6">
              <DetailedCategoryBreakdown
                data={dashboardStats?.detailedBreakdown}
                loading={statsLoading}
              />
            </div>
          </>
        )}

        {/* Export Analytics Report */}
        <div className="mt-6 print:hidden">
          <ExportAnalyticsReport data={dashboardStats} />
        </div>
      </div>
    </div>
  );
};

export default PersonalAnalysisDashboard;
