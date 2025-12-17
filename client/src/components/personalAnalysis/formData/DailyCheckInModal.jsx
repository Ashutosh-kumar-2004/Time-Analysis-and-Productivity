import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import useDailyCheckIn from "../../../hooks/personalAnalysis/useDailyCheckIn";
import DailyLogView from "./DailyLogView";
import DailyLogDetails from "./DailyLogDetails";

const DailyCheckInModal = ({ isOpen, onClose }) => {
  const { fetchCheckInByDate, saveCheckIn, loading } = useDailyCheckIn();
  const [view, setView] = useState("checkin"); // 'checkin' or 'history'

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [selectedLog, setSelectedLog] = useState(null);

  const [priorities, setPriorities] = useState([""]);
  const [energy, setEnergy] = useState(null);
  const [mood, setMood] = useState(null);
  const [stress, setStress] = useState(null);
  const [focus, setFocus] = useState([]);
  const [motivation, setMotivation] = useState("");

  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        // Fetch data for the selected date
        const data = await fetchCheckInByDate(selectedDate);
        if (data) {
          setPriorities(data.priorities?.length ? data.priorities : [""]);
          setEnergy(data.energyLevel);
          setMood(data.moodLevel);
          setStress(data.stressLevel);
          setFocus(data.focusAreas || []);
          setMotivation(data.motivation || "");
        } else {
          // Reset form if no data found for date
          setPriorities([""]);
          setEnergy(null);
          setMood(null);
          setStress(null);
          setFocus([]);
          setMotivation("");
        }
      };
      loadData();
    }
  }, [isOpen, selectedDate, fetchCheckInByDate]);

  const handleSave = async () => {
    const data = {
      date: selectedDate, // Include selected date
      priorities: priorities.filter((p) => p.trim()),
      energyLevel: energy,
      moodLevel: mood,
      stressLevel: stress,
      focusAreas: focus,
      motivation,
    };

    const success = await saveCheckIn(data);
    if (success) {
      onClose();
    }
  };

  const toggleFocus = (item) => {
    setFocus((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item]
    );
  };

  const handleViewLog = (log) => {
    setSelectedLog(log);
  };

  const handleEditLog = (date) => {
    // Extract date string YYYY-MM-DD
    const dateStr = new Date(date).toISOString().split("T")[0];
    setSelectedDate(dateStr);
    setView("checkin");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-3xl mx-auto rounded-2xl bg-white dark:bg-[#1e1e1e] shadow-2xl p-6 md:p-8 transition-colors animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-white/10 flex flex-col h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 dark:text-gray-500 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Tabs */}
        <div className="text-center mb-6 shrink-0">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Daily Journal
          </h2>
          <div className="flex justify-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-lg inline-flex mx-auto">
            <button
              onClick={() => setView("checkin")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === "checkin"
                  ? "bg-white dark:bg-[#1e1e1e] text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Today's Check-in
            </button>
            <button
              onClick={() => setView("history")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === "history"
                  ? "bg-white dark:bg-[#1e1e1e] text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              History Log
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-2">
          {view === "history" ? (
            selectedLog ? (
              <DailyLogDetails
                log={selectedLog}
                onClose={() => setSelectedLog(null)}
              />
            ) : (
              <DailyLogView onView={handleViewLog} onEdit={handleEditLog} />
            )
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-gray-100 dark:border-white/10">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {selectedDate === new Date().toISOString().split("T")[0]
                    ? "Today"
                    : "Backdating enty"}
                </p>
              </div>

              {/* Priorities */}
              <section className="mb-6">
                <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
                  Today’s Priorities
                </h3>
                {priorities.map((p, i) => (
                  <input
                    key={i}
                    value={p}
                    onChange={(e) => {
                      const copy = [...priorities];
                      copy[i] = e.target.value;
                      setPriorities(copy);
                    }}
                    placeholder={`Priority task ${i + 1}`}
                    className="w-full mb-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
                <button
                  onClick={() => setPriorities([...priorities, ""])}
                  className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Plus size={16} /> Add priority
                </button>
              </section>

              {/* Energy & Mood */}
              <section className="mb-6">
                <h3 className="font-medium mb-4 text-gray-800 dark:text-gray-200">
                  Energy & Mood
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Energy", "Mood", "Stress"].map((label, idx) => {
                    const setter = [setEnergy, setMood, setStress][idx];
                    const value = [energy, mood, stress][idx];
                    return (
                      <div key={label}>
                        <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
                          {label}
                        </p>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              onClick={() => setter(n)}
                              className={`w-9 h-9 rounded-full border text-sm transition-all
                          ${
                            value === n
                              ? "bg-blue-600 text-white border-blue-600 scale-110"
                              : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-400"
                          }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Focus Areas */}
              <section className="mb-6">
                <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200">
                  Focus Areas
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {[
                    "Studies",
                    "Projects",
                    "Health",
                    "Social",
                    "Personal",
                    "Other",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={focus.includes(item)}
                        onChange={() => toggleFocus(item)}
                        className="accent-blue-600 w-4 h-4 rounded border-gray-300"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </section>

              {/* Motivation */}
              <section className="mb-6">
                <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
                  Today’s Motivation
                </h3>
                <textarea
                  rows={3}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="What’s motivating you today?"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </section>

              {/* Actions */}
              <div className="flex flex-col md:flex-row gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Check‑in"}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCheckInModal;
