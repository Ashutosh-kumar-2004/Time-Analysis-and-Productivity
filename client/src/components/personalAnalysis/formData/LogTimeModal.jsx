import React, { useState, useEffect } from "react";
import {
  BookOpen,
  User,
  HeartPulse,
  Rocket,
  Users,
  FileText,
  Calendar,
  X,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { usePersonalAnalysis } from "../../../context/personalAnalysis/PersonalAnalysisContext";
import useCreatePersonalTask from "../../../hooks/personalAnalysis/useCreatePersonalTask";
import useTaskActions from "../../../hooks/personalAnalysis/useTaskActions";
import { toast } from "react-toastify";

const categories = [
  { label: "studies", icon: BookOpen },
  { label: "personal", icon: User },
  { label: "health", icon: HeartPulse },
  { label: "work", icon: Rocket }, // Changed Projects -> Work to match typical enums, or map it
  { label: "social", icon: Users },
  { label: "other", icon: FileText },
];

const LogTimeModal = ({ isOpen, onClose, editEntry = null }) => {
  const { tasks, refreshTasks } = usePersonalAnalysis();
  const { createTask } = useCreatePersonalTask();
  const { logManualTime, updateTimeEntry } = useTaskActions();

  const [taskInput, setTaskInput] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [category, setCategory] = useState("studies");
  const [focus, setFocus] = useState(3);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize dates when modal opens or editEntry changes
  useEffect(() => {
    if (isOpen) {
      if (editEntry) {
        // Edit Mode: Pre-fill data
        const format = (d) => {
          const date = new Date(d);
          const pad = (n) => n.toString().padStart(2, "0");
          return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate()
          )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };

        setTaskInput(editEntry.taskTitle || editEntry.title || "");
        setSelectedTaskId(editEntry.taskId?._id || editEntry.taskId || "");
        setCategory(editEntry.category || "studies");
        setFocus(editEntry.focusScore || 3);
        setStartTime(
          editEntry.startTimestamp ? format(editEntry.startTimestamp) : ""
        );
        setEndTime(
          editEntry.endTimestamp ? format(editEntry.endTimestamp) : ""
        );
      } else {
        // Create Mode: Default values
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        const format = (d) => {
          const pad = (n) => n.toString().padStart(2, "0");
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
            d.getDate()
          )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };

        setEndTime(format(now));
        setStartTime(format(oneHourAgo));
        setTaskInput("");
        setSelectedTaskId("");
        setCategory("studies");
        setFocus(3);
      }
    }
  }, [isOpen, editEntry]);

  const handleSubmit = async () => {
    if (!startTime || !endTime) {
      toast.error("Please select start and end times");
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      toast.error("End time must be after start time");
      return;
    }

    if (!taskInput && !selectedTaskId) {
      toast.error("Please enter a task description or select an existing task");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalTaskId = selectedTaskId;

      // If no existing task selected, create one (only if not editing an entry that already has a task)
      // Note: If editing, we might be changing the task, or creating a new one.
      // If selectedTaskId is empty but taskInput is present, we create a new task.
      if (!finalTaskId) {
        const newTask = await createTask({
          taskTitle: taskInput,
          category: category.toLowerCase(),
          priority: "medium", // Default
          estimatedDuration: 60, // Default for manual entry
        });
        if (newTask) {
          finalTaskId = newTask._id || newTask.id;
        } else {
          throw new Error("Failed to create new task");
        }
      }

      // Prepare timestamps
      const start = new Date(startTime);
      const end = new Date(endTime);

      let success;
      if (editEntry) {
        // Update existing entry
        success = await updateTimeEntry(editEntry.id || editEntry._id, {
          taskId: finalTaskId,
          startTimestamp: start,
          endTimestamp: end,
          focusScore: focus,
          additionalNotes: taskInput && selectedTaskId ? taskInput : "",
        });
      } else {
        // Create new entry
        success = await logManualTime({
          taskId: finalTaskId,
          startTimestamp: start,
          endTimestamp: end,
          focusScore: focus,
          additionalNotes: taskInput && selectedTaskId ? taskInput : "",
        });
      }

      if (success) {
        refreshTasks(); // Refresh context
        onClose();
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDuration = () => {
    if (!startTime || !endTime) return "0h 0m";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end - start;
    if (diff < 0) return "Invalid";

    const minutes = Math.floor(diff / 60000);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl rounded-2xl bg-white dark:bg-[#1e1e1e] shadow-2xl p-6 md:p-8 transition-colors max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6 relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {editEntry ? "Edit Time Log" : "Log Time Manually"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            What did you work on?
          </p>
        </div>

        {/* Task Input */}
        <div className="mb-6">
          <input
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="e.g., Math homework, Coding practice"
            className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
          {selectedTaskId && (
            <p className="text-xs text-blue-500 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Linked to selected task below
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Category */}
            <section>
              <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                Category
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => {
                      setCategory(label);
                      setSelectedTaskId(""); // Clear task selection if changing category manual override
                    }}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm transition-all duration-200
                      ${
                        category === label
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                  >
                    <Icon size={18} />
                    <span className="capitalize">{label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Focus Level */}
            <section>
              <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                Focus Level
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 px-1">
                <span>Distracted</span>
                <span>Focused</span>
              </div>
              <div className="flex gap-2 justify-between">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setFocus(n)}
                    className={`w-10 h-10 rounded-full border transition-all duration-200 flex items-center justify-center font-medium
                      ${
                        focus === n
                          ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/30 scale-110"
                          : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-500/50"
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Time Spent */}
            <section>
              <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
                Time Spent
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">
                    Start Time
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">
                    End Time
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>
                    Duration:{" "}
                    <span className="font-semibold">{calculateDuration()}</span>
                  </span>
                </div>
              </div>
            </section>

            {/* Related Task */}
            <section>
              <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
                Related Task (optional)
              </h3>
              <select
                value={selectedTaskId}
                onChange={(e) => {
                  setSelectedTaskId(e.target.value);
                  // Optional: Update category based on selected task
                  const t = tasks.find((task) => task.id === e.target.value);
                  if (t && t.category) setCategory(t.category);
                }}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2a2a2a] px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="" className="text-gray-500">
                  -- Create new task from input --
                </option>
                {tasks
                  .filter((t) => t.status !== "completed")
                  .map((task) => (
                    <option
                      key={task.id}
                      value={task.id}
                      className="text-gray-900 dark:text-gray-100 bg-white dark:bg-[#2a2a2a]"
                    >
                      {task.taskTitle || task.title}
                    </option>
                  ))}
              </select>
            </section>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium transition-all shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : editEntry ? (
              "Update Log"
            ) : (
              "Log Time"
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 dark:border-white/10 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogTimeModal;
