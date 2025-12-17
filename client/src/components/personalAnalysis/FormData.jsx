import React from 'react';
import QuickActions from './formData/QuickActions';
import RecentActivity from './formData/RecentActivity';
import FocusTrends from './formData/FocusTrends';

const FormData = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <QuickActions />
            <div className="flex flex-col lg:flex-row gap-6">
                <RecentActivity />
                <FocusTrends />
            </div>
        </div>
    );
};

export default FormData;