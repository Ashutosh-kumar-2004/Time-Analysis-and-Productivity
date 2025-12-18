import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ProductivityTrendChart = ({ data, loading }) => {
  const { isDark } = useContext(ThemeContext);

  const chartData = data || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`px-4 py-3 rounded-lg shadow-lg ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <p
            className={`font-semibold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
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
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
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
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <h3
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Productivity Trend Analysis
        </h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#374151" : "#E5E7EB"}
            />
            <XAxis
              dataKey="date"
              stroke={isDark ? "#9CA3AF" : "#6B7280"}
              style={{ fontSize: "12px" }}
            />
            <YAxis
              domain={[0, 100]}
              stroke={isDark ? "#9CA3AF" : "#6B7280"}
              style={{ fontSize: "12px" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: isDark ? "#E5E7EB" : "#374151" }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="productivity"
              name="Productivity Score"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              name="Efficiency Rate"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: "#10B981", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductivityTrendChart;
