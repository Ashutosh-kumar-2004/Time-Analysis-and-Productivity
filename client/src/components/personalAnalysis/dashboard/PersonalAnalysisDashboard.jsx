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

  const timeRanges = [
    { id: "today", label: "Today", icon: FiCalendar },
    { id: "week", label: "This Week", icon: FiCalendar },
    { id: "month", label: "This Month", icon: FiCalendar },
    { id: "custom", label: "Custom Range", icon: FiCalendar },
  ];

  useEffect(() => {
    if (activeTimeRange !== "Custom Range") {
      fetchDashboardStats(activeTimeRange);
    }
  }, [activeTimeRange, fetchDashboardStats]);

  // Custom Date States
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      // Basic validation
      if (new Date(customStartDate) > new Date(customEndDate)) {
        alert("Start date cannot be after end date");
        return;
      }
      fetchDashboardStats("custom", {
        startDate: customStartDate,
        endDate: customEndDate,
      });
    }
  };

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

        {/* Custom Date Range Picker */}
        {activeTimeRange === "Custom Range" && (
          <div
            className={`rounded-xl p-4 mb-6 -mt-4 animate-in fade-in slide-in-from-top-2 duration-200 ${
              isDark
                ? "bg-gray-800 border-x border-b border-gray-700"
                : "bg-white border-x border-b border-gray-200"
            }`}
          >
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <button
                onClick={handleCustomDateSubmit}
                disabled={!customStartDate || !customEndDate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Apply Range
              </button>
            </div>
          </div>
        )}
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
