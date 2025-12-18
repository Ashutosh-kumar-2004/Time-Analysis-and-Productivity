import React, { useState, useEffect } from "react";
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
import ViewTimeLogModal from "./formData/ViewTimeLogModal";
import {
  PersonalAnalysisProvider,
  usePersonalAnalysis,
} from "../../context/personalAnalysis/PersonalAnalysisContext";

const FormDataContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isLogTimeModalOpen, setIsLogTimeModalOpen] = useState(false);
  const [isActivityHistoryOpen, setIsActivityHistoryOpen] = useState(false);
  const [isViewLogModalOpen, setIsViewLogModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [viewingEntry, setViewingEntry] = useState(null);

  // Fetch stats for FocusTrends
  const { dashboardStats, fetchDashboardStats } = usePersonalAnalysis();

  useEffect(() => {
    // Fetch 'This Week' stats to populate Focus trends (which always returns last 7 days anyway)
    fetchDashboardStats("This Week");
  }, [fetchDashboardStats]);

  const handleEditTimeLog = (entry) => {
    setEditingEntry(entry);
    setIsLogTimeModalOpen(true);
  };

  const handleViewTimeLog = (entry) => {
    setViewingEntry(entry);
    setIsViewLogModalOpen(true);
  };

  const handleLogTimeClose = () => {
    setIsLogTimeModalOpen(false);
    setEditingEntry(null);
  };

  return (
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
          onView={handleViewTimeLog}
        />
        <FocusTrends data={dashboardStats?.focusTrends} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActiveTasks />
        <DailyActivityLog
          onOpenCheckIn={() => setIsCheckInModalOpen(true)}
          onOpenHistory={() => setIsActivityHistoryOpen(true)}
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
        onView={handleViewTimeLog}
      />

      <ViewTimeLogModal
        isOpen={isViewLogModalOpen}
        onClose={() => setIsViewLogModalOpen(false)}
        entry={viewingEntry}
      />
    </div>
  );
};

const FormData = () => {
  return (
    <PersonalAnalysisProvider>
      <FormDataContent />
    </PersonalAnalysisProvider>
  );
};

export default FormData;
