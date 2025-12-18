import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const FocusTrends = ({ data }) => {
  const chartData = data || [
    { day: "Mon", focus: 0 },
    { day: "Tue", focus: 0 },
    { day: "Wed", focus: 0 },
    { day: "Thu", focus: 0 },
    { day: "Fri", focus: 0 },
    { day: "Sat", focus: 0 },
    { day: "Sun", focus: 0 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 w-full h-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Focus Trends
      </h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={true}
              stroke="#e5e7eb"
              className="dark:opacity-10 dark:stroke-gray-600"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
                color: "#f3f4f6",
              }}
              itemStyle={{ color: "#e5e7eb" }}
              labelStyle={{ color: "#9ca3af", marginBottom: "0.5rem" }}
            />
            <Line
              type="monotone"
              dataKey="focus"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4, stroke: "#fff" }}
              activeDot={{
                r: 6,
                stroke: "#3b82f6",
                strokeWidth: 4,
                fill: "#fff",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FocusTrends;
