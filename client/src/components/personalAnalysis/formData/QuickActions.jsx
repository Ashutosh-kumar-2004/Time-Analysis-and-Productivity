import React from 'react';
import { Play, Plus, Calendar, Clock } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: 'Start Tracking',
      icon: <Play className="w-5 h-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => console.log('Start Tracking')
    },
    {
      title: 'Add Task',
      icon: <Plus className="w-5 h-5" />,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      action: () => console.log('Add Task')
    },
    {
      title: 'Daily Check-in',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => console.log('Daily Check-in')
    },
    {
      title: 'Log Time',
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-amber-500 hover:bg-amber-600',
      action: () => console.log('Log Time')
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`${action.color} text-white p-4 rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-none transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-3 font-medium border border-white/10`}
          >
            {action.icon}
            {action.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
