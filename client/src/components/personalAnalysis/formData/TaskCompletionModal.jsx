import React, { useState } from "react";
import { Star, Clock, MessageSquare, Award } from "lucide-react";
import useCompleteTask from "../../../hooks/personalAnalysis/useCompleteTask";
import { usePersonalAnalysis } from "../../../context/personalAnalysis/PersonalAnalysisContext";

const TaskCompletionModal = ({ isOpen, onClose, task, onCompleteSuccess }) => {
  const { completeTask, loading } = useCompleteTask();
  const { refreshTasks } = usePersonalAnalysis(); // Or use passed success callback if simpler

  const [formData, setFormData] = useState({
    timeSpentInMinutes: 0,
    focusScore: 3,
    userRating: 3,
    whatWentWell: "",
    challengesFaced: "",
  });

  if (!isOpen || !task) return null;

  const handleSubmit = async () => {
    const completionData = {
      timeSpentInMinutes: parseInt(formData.timeSpentInMinutes),
      focusScore: formData.focusScore,
      userRating: formData.userRating,
      feedback: {
        whatWentWell: formData.whatWentWell,
        challengesFaced: formData.challengesFaced,
      },
    };

    const success = await completeTask(task.id, completionData);
    if (success) {
      refreshTasks();
      if (onCompleteSuccess) onCompleteSuccess();
      onClose();
      // Reset form
      setFormData({
        timeSpentInMinutes: 0,
        focusScore: 3,
        userRating: 3,
        whatWentWell: "",
        challengesFaced: "",
      });
    }
  };

  const renderStars = (value, field) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setFormData((prev) => ({ ...prev, [field]: star }))}
            className={`p-1 transition-all hover:scale-110 ${
              star <= value
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          >
            <Star className="w-6 h-6" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 dark:border-white/10 p-6 transform transition-all animate-in fade-in zoom-in-95">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Task Completed!
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Great job on finishing{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              "{task.title}"
            </span>
          </p>
        </div>

        <div className="space-y-6">
          {/* Time Spent */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="w-4 h-4" />
              Time Spent (minutes)
            </label>
            <input
              type="number"
              value={formData.timeSpentInMinutes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  timeSpentInMinutes: e.target.value,
                }))
              }
              className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Ratings Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Focus Score
              </label>
              {renderStars(formData.focusScore, "focusScore")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Satisfaction
              </label>
              {renderStars(formData.userRating, "userRating")}
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <MessageSquare className="w-4 h-4" />
              Reflection
            </label>
            <textarea
              placeholder="What went well?"
              value={formData.whatWentWell}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  whatWentWell: e.target.value,
                }))
              }
              className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none resize-none"
              rows="2"
            ></textarea>
            <textarea
              placeholder="Challenges faced?"
              value={formData.challengesFaced}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  challengesFaced: e.target.value,
                }))
              }
              className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none resize-none"
              rows="2"
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold shadow-lg shadow-green-500/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Completing..." : "Complete Task"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 py-2.5 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionModal;
