import React, { useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CategoryComparisonChart = () => {
  const { isDark } = useContext(ThemeContext);

  const data = [
    { category: 'Work', thisWeek: 18, lastWeek: 16 },
    { category: 'Meetings', thisWeek: 8, lastWeek: 9 },
    { category: 'Development', thisWeek: 12, lastWeek: 10.5 },
    { category: 'Learning', thisWeek: 5.5, lastWeek: 4 },
    { category: 'Breaks', thisWeek: 3.5, lastWeek: 4.5 },
    { category: 'Personal', thisWeek: 4, lastWeek: 3.5 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`px-4 py-3 rounded-lg shadow-lg ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          <p className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value} hours
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
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      } shadow-sm`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3
          className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Category Comparison (This Week vs Last Week)
        </h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={5}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#374151' : '#E5E7EB'}
            />
            <XAxis
              dataKey="category"
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
              style={{ fontSize: '12px' }}
              label={{
                value: 'Hours',
                angle: -90,
                position: 'insideLeft',
                style: { fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: '12px' },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: isDark ? '#E5E7EB' : '#374151' }}
              iconType="circle"
            />
            <Bar
              dataKey="thisWeek"
              name="This Week"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="lastWeek"
              name="Last Week"
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryComparisonChart;
