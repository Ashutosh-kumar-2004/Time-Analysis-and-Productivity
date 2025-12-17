import React, { useState } from "react";
import QuickActions from "./formData/QuickActions";
import RecentActivity from "./formData/RecentActivity";
import FocusTrends from "./formData/FocusTrends";
import ActiveTasks from "./formData/ActiveTasks";
import Goals from "./formData/Goals";
import CreateTaskModal from "./formData/CreateTaskModal";
import { PersonalAnalysisProvider } from "../../context/personalAnalysis/PersonalAnalysisContext";

const FormData = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <PersonalAnalysisProvider>
      <div className="p-6 max-w-7xl mx-auto space-y-6 relative">
        <QuickActions onAddTask={() => setIsModalOpen(true)} />
        <div className="flex flex-col lg:flex-row gap-6">
          <RecentActivity />
          <FocusTrends />
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <ActiveTasks />
          <Goals />
        </div>

        {/* Modal Portal/Overlay */}
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </PersonalAnalysisProvider>
  );
};

export default FormData;
