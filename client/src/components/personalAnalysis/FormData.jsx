import React, { useState } from "react";
import QuickActions from "./formData/QuickActions";
import RecentActivity from "./formData/RecentActivity";
import FocusTrends from "./formData/FocusTrends";
import ActiveTasks from "./formData/ActiveTasks";
import MotivationalQuote from "./formData/MotivationalQuote";
import CreateTaskModal from "./formData/CreateTaskModal";
import DailyCheckInModal from "./formData/DailyCheckInModal";
import DailyActivityLog from "./formData/DailyActivityLog";
import LogTimeModal from "./formData/LogTimeModal";
import ActivityHistoryModal from "./formData/ActivityHistoryModal";
import { PersonalAnalysisProvider } from "../../context/personalAnalysis/PersonalAnalysisContext";

const FormData = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isLogTimeModalOpen, setIsLogTimeModalOpen] = useState(false);
  const [isActivityHistoryOpen, setIsActivityHistoryOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const handleEditTimeLog = (entry) => {
    setEditingEntry(entry);
    setIsLogTimeModalOpen(true);
  };

  const handleLogTimeClose = () => {
    setIsLogTimeModalOpen(false);
    setEditingEntry(null);
  };

  return (
    <PersonalAnalysisProvider>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6 relative">
        <QuickActions
          onAddTask={() => setIsModalOpen(true)}
          onCheckIn={() => setIsCheckInModalOpen(true)}
          onLogTime={() => {
            setEditingEntry(null);
            setIsLogTimeModalOpen(true);
          }}
        />
        <div className="flex flex-col lg:flex-row gap-6">
          <RecentActivity
            onViewAll={() => setIsActivityHistoryOpen(true)}
            onEdit={handleEditTimeLog}
          />
          <FocusTrends />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActiveTasks />
          <DailyActivityLog
            onOpenCheckIn={() => setIsCheckInModalOpen(true)}
            onOpenHistory={() => setIsCheckInModalOpen(true)}
          />
          <MotivationalQuote />
        </div>

        {/* Modal Portal/Overlay */}
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <DailyCheckInModal
          isOpen={isCheckInModalOpen}
          onClose={() => setIsCheckInModalOpen(false)}
        />

        <LogTimeModal
          isOpen={isLogTimeModalOpen}
          onClose={handleLogTimeClose}
          editEntry={editingEntry}
        />

        <ActivityHistoryModal
          isOpen={isActivityHistoryOpen}
          onClose={() => setIsActivityHistoryOpen(false)}
          onEdit={handleEditTimeLog}
        />
      </div>
    </PersonalAnalysisProvider>
  );
};

export default FormData;
