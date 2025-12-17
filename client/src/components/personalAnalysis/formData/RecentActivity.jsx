import React from 'react';
import { Clock, CheckCircle, Phone, Code } from 'lucide-react';

const RecentActivity = () => {
    const activities = [
        {
            id: 1,
            title: 'Complete Math Assignment',
            duration: '2h 15m',
            focus: '4/5',
            timeAgo: '2 hours ago',
            category: 'academic studies',
            icon: <Clock className="w-5 h-5 text-blue-500" />,
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            pill: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
        },
        {
            id: 2,
            title: 'Physics Lab Report',
            timeAgo: '4 hours ago',
            category: 'assignment work',
            icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
            bg: 'bg-emerald-100 dark:bg-emerald-900/30',
            pill: null // No specific pill for this one in the mockup, but we can maintain structure
        },
        {
            id: 3,
            title: 'Phone call',
             INTERRUPTION: '15m interruption',
            timeAgo: '5 hours ago',
            category: 'other',
            icon: <Phone className="w-5 h-5 text-red-500" />,
            bg: 'bg-red-100 dark:bg-red-900/30',
            pill: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
        },
        {
            id: 4,
            title: 'React Project Development',
            duration: '1h 30m',
            focus: '5/5',
            timeAgo: '6 hours ago',
            category: 'project development',
            icon: <Code className="w-5 h-5 text-indigo-500" />,
            bg: 'bg-indigo-100 dark:bg-indigo-900/30',
            pill: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200'
        }
    ];

    return (
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 w-full lg:flex-1">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Activity</h2>
                <button className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors">View All</button>
            </div>

            <div className="space-y-6">
                {activities.map((item) => (
                    <div key={item.id} className="flex gap-4 items-start group">
                        <div className={`p-3 rounded-xl ${item.bg} flex-shrink-0 transition-transform group-hover:scale-110`}>
                            {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="text-gray-900 dark:text-gray-100 font-semibold truncate">
                                    {item.title}
                                </h3>
                                {(item.duration || item.INTERRUPTION) && (
                                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${item.pill || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                        {item.INTERRUPTION || `${item.duration} • Focus: ${item.focus}`}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                                <span>{item.timeAgo}</span>
                                <span className="text-gray-300 dark:text-gray-600">•</span>
                                <span className="capitalize">{item.category}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
