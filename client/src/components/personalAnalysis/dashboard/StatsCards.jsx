import React, { useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { FiClock, FiTrendingUp, FiTarget, FiZap } from 'react-icons/fi';

const StatsCards = () => {
  const { isDark } = useContext(ThemeContext);

  const stats = [
    {
      id: 1,
      title: 'Total Tracked Time',
      value: '42.5',
      unit: 'hours',
      trend: '+12.3%',
      trendUp: true,
      icon: FiClock,
      iconBg: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Productivity Score',
      value: '87',
      unit: '%',
      trend: '+5.2%',
      trendUp: true,
      icon: FiTrendingUp,
      iconBg: 'bg-green-500',
    },
    {
      id: 3,
      title: 'Goal Achievement',
      value: '92',
      unit: '%',
      trend: '+8.1%',
      trendUp: true,
      icon: FiTarget,
      iconBg: 'bg-purple-500',
    },
    {
      id: 4,
      title: 'Efficiency Rate',
      value: '78',
      unit: '%',
      trend: '-2.4%',
      trendUp: false,
      icon: FiZap,
      iconBg: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={stat.id}
            className={`rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
              isDark
                ? 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                : 'bg-white border border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Icon and Trend */}
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.iconBg} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trendUp ? 'text-green-500' : 'text-red-500'
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {stat.trendUp ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  )}
                </svg>
                {stat.trend}
              </div>
            </div>

            {/* Title */}
            <h3
              className={`text-sm font-medium mb-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {stat.title}
            </h3>

            {/* Value */}
            <div className="flex items-baseline gap-1">
              <span
                className={`text-3xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {stat.value}
              </span>
              <span
                className={`text-lg font-medium ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {stat.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
