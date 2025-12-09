// import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useParams } from "react-router-dom";
// import {
//   FaTimes,
//   FaPlus,
//   FaUser,
//   FaCalendar,
//   FaClock,
//   FaTag,
// } from "react-icons/fa";

// const CreateTaskModal = () => {
//   const { projectID } = useParams();
//   const dispatch = useDispatch();

//   const projects = useSelector((state) => state.project.projects || []);
//   const currentProject = projects.find((p) => p._id === projectID);
//   const activeMembers = currentProject?.teamMembers || [];
//   const currentUser = useSelector((state) => state.auth.user);

//   const [taskData, setTaskData] = useState({
//     title: "",
//     description: "",
//     projectId: projectID,
//     priority: "medium",
//     dueDate: "",
//     assignedTo: "",
//     estimatedHours: 0,
//     labels: [],
//   });

//   const [subtasks, setSubtasks] = useState([]);
//   const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
//   const [newSubtaskHours, setNewSubtaskHours] = useState("");
//   const [newSubtaskAssignee, setNewSubtaskAssignee] = useState("");
//   const [newLabel, setNewLabel] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const availableLabels = [
//     "bug",
//     "feature",
//     "design",
//     "frontend",
//     "backend",
//     "urgent",
//     "review",
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTaskData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleKeyPress = (e, action) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       action();
//     }
//   };

//   const handleAddCustomLabel = () => {
//     if (newLabel.trim() && !taskData.labels.includes(newLabel.trim())) {
//       setTaskData((prev) => ({
//         ...prev,
//         labels: [...prev.labels, newLabel.trim()],
//       }));
//       setNewLabel("");
//     }
//   };

//   const handleLabelToggle = (label) => {
//     setTaskData((prev) => ({
//       ...prev,
//       labels: prev.labels.includes(label)
//         ? prev.labels.filter((l) => l !== label)
//         : [...prev.labels, label],
//     }));
//   };

//   const handleAddSubtask = () => {
//     if (newSubtaskTitle.trim()) {
//       const subtaskToAdd = {
//         title: newSubtaskTitle.trim(),
//         estimatedHours: parseFloat(newSubtaskHours) || 0,
//         assignedTo: newSubtaskAssignee || null,
//       };
//       setSubtasks([...subtasks, subtaskToAdd]);
//       setNewSubtaskTitle("");
//       setNewSubtaskHours("");
//       setNewSubtaskAssignee("");
//     }
//   };

//   const handleRemoveSubtask = (index) => {
//     setSubtasks(subtasks.filter((_, i) => i !== index));
//   };

//   const calculateTotalSubtaskHours = () => {
//     return subtasks.reduce(
//       (total, subtask) => total + (subtask.estimatedHours || 0),
//       0
//     );
//   };

//   const getSuggestedDueDate = () => {
//     const date = new Date();
//     date.setDate(date.getDate() + 7);
//     return date.toISOString().split("T")[0];
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!taskData.title.trim()) {
//       alert("Task title is required");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const taskToSubmit = {
//         ...taskData,
//         createdBy: currentUser?._id,
//         subtasks: subtasks.map((st, index) => ({
//           title: st.title,
//           estimatedHours: st.estimatedHours || 0,
//           assignedTo: st.assignedTo,
//           order: index,
//         })),
//         assignedTo:
//           taskData.assignedTo ||
//           (activeMembers.some((m) => m._id === currentUser?._id)
//             ? currentUser?._id
//             : ""),
//       };

//       await dispatch(createTask(taskToSubmit));
//       closeModal();
//     } catch (error) {
//       console.error("Error creating task:", error);
//       alert("Failed to create task. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const closeModal = () => {
//     resetForm();
//     window.history.back();
//   };

//   const resetForm = () => {
//     setTaskData({
//       title: "",
//       description: "",
//       projectId: projectID,
//       priority: "medium",
//       dueDate: "",
//       assignedTo: "",
//       estimatedHours: 0,
//       labels: [],
//     });
//     setSubtasks([]);
//     setNewSubtaskTitle("");
//     setNewSubtaskHours("");
//     setNewSubtaskAssignee("");
//     setNewLabel("");
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div
//         className="fixed inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={closeModal}
//       />
//       <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl">
//         <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 rounded-t-2xl">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//               Create New Task
//             </h2>
//             <button
//               onClick={closeModal}
//               className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
//             >
//               <FaTimes className="w-5 h-5" />
//             </button>
//           </div>
//           <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//             Add a new task to "{currentProject?.name || "Project"}"
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Task Title */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Task Title *
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={taskData.title}
//               onChange={handleChange}
//               placeholder="What needs to be done?"
//               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//               autoFocus
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={taskData.description}
//               onChange={handleChange}
//               rows="3"
//               placeholder="Describe the task in detail..."
//               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//             />
//           </div>

//           {/* Grid: Priority, Due Date, Assignee, Hours */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Priority buttons */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Priority
//               </label>
//               <div className="grid grid-cols-4 gap-2">
//                 {["low", "medium", "high", "critical"].map((level) => (
//                   <button
//                     key={level}
//                     type="button"
//                     onClick={() =>
//                       setTaskData({ ...taskData, priority: level })
//                     }
//                     className={`py-2.5 text-sm font-medium rounded-lg transition-all ${
//                       taskData.priority === level
//                         ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800"
//                         : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                     }`}
//                   >
//                     {level.charAt(0).toUpperCase() + level.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Due Date */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Due Date
//               </label>
//               <div className="relative">
//                 <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="date"
//                   name="dueDate"
//                   value={taskData.dueDate}
//                   onChange={handleChange}
//                   min={new Date().toISOString().split("T")[0]}
//                   className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 {!taskData.dueDate && (
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setTaskData({
//                         ...taskData,
//                         dueDate: getSuggestedDueDate(),
//                       })
//                     }
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
//                   >
//                     +7 days
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Assignee */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Assign To
//               </label>
//               <div className="relative">
//                 <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <select
//                   name="assignedTo"
//                   value={taskData.assignedTo}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
//                 >
//                   <option value="">Select assignee</option>
//                   <option value="">Unassigned</option>
//                   {activeMembers.map((member) => (
//                     <option key={member._id} value={member._id}>
//                       {member.firstName} {member.lastName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Estimated Hours */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Estimated Hours
//               </label>
//               <div className="relative">
//                 <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="number"
//                   name="estimatedHours"
//                   value={taskData.estimatedHours}
//                   onChange={handleChange}
//                   placeholder="0"
//                   min="0"
//                   step="0.5"
//                   className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Labels */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Labels
//             </label>
//             <div className="flex flex-wrap gap-2 mb-3">
//               {availableLabels.map((label) => (
//                 <button
//                   key={label}
//                   type="button"
//                   onClick={() => handleLabelToggle(label)}
//                   className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                     taskData.labels.includes(label)
//                       ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800"
//                       : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                   }`}
//                 >
//                   <FaTag className="w-3 h-3" />
//                   {label}
//                 </button>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={newLabel}
//                 onChange={(e) => setNewLabel(e.target.value)}
//                 onKeyPress={(e) => handleKeyPress(e, handleAddCustomLabel)}
//                 placeholder="Add custom label"
//                 className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//               <button
//                 type="button"
//                 onClick={handleAddCustomLabel}
//                 className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
//               >
//                 Add
//               </button>
//             </div>
//           </div>

//           {/* Subtasks */}
//           <div>
//             <div className="flex justify-between items-center mb-3">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Subtasks (Optional)
//               </label>
//               <span className="text-sm text-gray-500 dark:text-gray-400">
//                 {subtasks.length} added • Total: {calculateTotalSubtaskHours()}h
//               </span>
//             </div>

//             {/* Subtask List */}
//             {subtasks.length > 0 && (
//               <div className="space-y-2 mb-3">
//                 {subtasks.map((subtask, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
//                   >
//                     <div className="flex-1 flex items-center gap-3">
//                       <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-700 flex items-center justify-center">
//                         <span className="text-xs text-gray-500">
//                           {index + 1}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-gray-700 dark:text-gray-300 block">
//                           {subtask.title}
//                         </span>
//                         {subtask.estimatedHours > 0 && (
//                           <span className="text-xs text-gray-500 dark:text-gray-400 block">
//                             {subtask.estimatedHours}h
//                           </span>
//                         )}
//                         {subtask.assignedTo && (
//                           <span className="text-xs text-gray-500 dark:text-gray-400 block">
//                             Assigned to:{" "}
//                             {activeMembers.find(
//                               (m) => m._id === subtask.assignedTo
//                             )?.firstName || "Unknown"}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveSubtask(index)}
//                       className="p-1 text-red-500 hover:text-red-700"
//                     >
//                       <FaTimes className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Add Subtask Input */}
//             <div className="flex gap-2 flex-wrap">
//               <input
//                 type="text"
//                 value={newSubtaskTitle}
//                 onChange={(e) => setNewSubtaskTitle(e.target.value)}
//                 onKeyPress={(e) => handleKeyPress(e, handleAddSubtask)}
//                 placeholder="Subtask title"
//                 className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <input
//                 type="number"
//                 value={newSubtaskHours}
//                 onChange={(e) => setNewSubtaskHours(e.target.value)}
//                 onKeyPress={(e) => handleKeyPress(e, handleAddSubtask)}
//                 placeholder="Hours"
//                 min="0"
//                 step="0.5"
//                 className="w-24 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <select
//                 value={newSubtaskAssignee}
//                 onChange={(e) => setNewSubtaskAssignee(e.target.value)}
//                 className="w-40 px-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="">No assignee</option>
//                 {activeMembers.map((member) => (
//                   <option key={member._id} value={member._id}>
//                     {member.firstName} {member.lastName}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 type="button"
//                 onClick={handleAddSubtask}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
//               >
//                 <FaPlus className="w-4 h-4" /> Add
//               </button>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
//             <button
//               type="button"
//               onClick={closeModal}
//               className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting || !taskData.title.trim()}
//               className={`px-6 py-3 text-white rounded-xl font-medium ${
//                 isSubmitting || !taskData.title.trim()
//                   ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {isSubmitting ? "Creating..." : "Create Task"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateTaskModal;
import React from 'react'

const CreateTaskModal = () => {
  return (
    <div>
      
    </div>
  )
}

export default CreateTaskModal
