// import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   FaCalendarAlt,
//   FaClock,
//   FaUser,
//   FaExclamationCircle,
//   FaEdit,
//   FaTrash,
//   FaChevronDown,
//   FaChevronUp,
//   FaPlus,
//   FaComment,
//   FaTasks,
//   FaCheckCircle,
//   FaPlayCircle,
//   FaPauseCircle,
// } from "react-icons/fa";
// import { format } from "date-fns";

// const TaskList = ({ 
//   tasks, 
//   loading, 
//   error, 
//   onTaskEdit, 
//   onTaskDelete, 
//   onTaskCreate,
//   isDark 
// }) => {
//   const dispatch = useDispatch();
//   const [expandedTasks, setExpandedTasks] = useState({});

//   const toggleTaskExpansion = (taskId) => {
//     setExpandedTasks(prev => ({
//       ...prev,
//       [taskId]: !prev[taskId]
//     }));
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority?.toLowerCase()) {
//       case "critical":
//         return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800";
//       case "high":
//         return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800";
//       case "medium":
//         return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
//       case "low":
//         return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800";
//       default:
//         return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//         return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
//       case "in-progress":
//         return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
//       case "todo":
//         return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
//       default:
//         return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//         return <FaCheckCircle className="text-green-500" />;
//       case "in-progress":
//         return <FaPlayCircle className="text-blue-500" />;
//       case "todo":
//         return <FaPauseCircle className="text-yellow-500" />;
//       default:
//         return <FaTasks className="text-gray-500" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "No due date";
//     try {
//       return format(new Date(dateString), "MMM dd, yyyy");
//     } catch (error) {
//       return "Invalid date";
//     }
//   };

//   const calculateProgress = (task) => {
//     if (!task.subtasks || task.subtasks.length === 0) {
//       return task.status === "completed" ? 100 : 0;
//     }
//     const completed = task.subtasks.filter(st => st.status === "completed").length;
//     return Math.round((completed / task.subtasks.length) * 100);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="text-center py-12">
//         <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//         <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <div className="text-red-500 mb-4">Error loading tasks: {error}</div>
//         <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//           Retry
//         </button>
//       </div>
//     );
//   }

//   // Empty state
//   if (!tasks || tasks.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center">
//           <FaTasks className="w-10 h-10 text-blue-500 dark:text-blue-400" />
//         </div>
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//           No tasks yet
//         </h3>
//         <p className="text-gray-600 dark:text-gray-400 mb-6">
//           Create your first task to get started
//         </p>
//         <button
//           onClick={onTaskCreate}
//           className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-medium"
//         >
//           <FaPlus /> Create First Task
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {tasks.map((task) => {
//         const progress = calculateProgress(task);
//         const isExpanded = expandedTasks[task._id];
        
//         return (
//           <div
//             key={task._id}
//             className={`rounded-xl border transition-all duration-300 hover:shadow-md ${
//               isDark
//                 ? "border-gray-700 bg-gray-800/50"
//                 : "border-gray-200 bg-white"
//             }`}
//           >
//             {/* Task Header */}
//             <div className="p-4">
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-2">
//                     <button
//                       onClick={() => toggleTaskExpansion(task._id)}
//                       className={`p-1 rounded transition-colors ${
//                         isDark
//                           ? "hover:bg-gray-700 text-gray-400"
//                           : "hover:bg-gray-100 text-gray-600"
//                       }`}
//                     >
//                       {isExpanded ? (
//                         <FaChevronUp className="w-4 h-4" />
//                       ) : (
//                         <FaChevronDown className="w-4 h-4" />
//                       )}
//                     </button>
                    
//                     <div className="flex items-center gap-2">
//                       {getStatusIcon(task.status)}
//                       <h3 className="font-bold text-lg text-gray-900 dark:text-white">
//                         {task.title}
//                       </h3>
//                     </div>

//                     <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
//                       <FaExclamationCircle className="inline mr-1" />
//                       {task.priority}
//                     </span>

//                     <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
//                       {task.status?.replace("-", " ") || "Todo"}
//                     </span>
//                   </div>

//                   {task.description && (
//                     <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 ml-9">
//                       {task.description}
//                     </p>
//                   )}

//                   {/* Task Metadata */}
//                   <div className="flex items-center gap-4 text-sm ml-9">
//                     <span className={`flex items-center gap-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
//                       <FaCalendarAlt className="w-4 h-4" />
//                       {formatDate(task.dueDate)}
//                     </span>
                    
//                     <span className={`flex items-center gap-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
//                       <FaClock className="w-4 h-4" />
//                       {task.estimatedHours}h
//                     </span>
                    
//                     {task.loggedHours > 0 && (
//                       <span className={`flex items-center gap-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
//                         <FaClock className="w-4 h-4" />
//                         Logged: {task.loggedHours}h
//                       </span>
//                     )}
                    
//                     {task.assignedTo && (
//                       <span className={`flex items-center gap-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
//                         <FaUser className="w-4 h-4" />
//                         Assigned
//                       </span>
//                     )}

//                     {task.subtasks && task.subtasks.length > 0 && (
//                       <span className={`flex items-center gap-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
//                         <FaTasks className="w-4 h-4" />
//                         {task.subtasks.length} subtasks
//                       </span>
//                     )}

//                     {task.comments && task.comments.length > 0 && (
//                       <span className={`flex items-center gap-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
//                         <FaComment className="w-4 h-4" />
//                         {task.comments.length} comments
//                       </span>
//                     )}
//                   </div>

//                   {/* Progress Bar */}
//                   {(task.subtasks && task.subtasks.length > 0) && (
//                     <div className="mt-3 ml-9">
//                       <div className="flex justify-between items-center mb-1">
//                         <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
//                           Subtask Progress
//                         </span>
//                         <span className="text-xs font-semibold text-gray-900 dark:text-white">
//                           {progress}%
//                         </span>
//                       </div>
//                       <div className={`w-full h-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
//                         <div 
//                           className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
//                           style={{ width: `${progress}%` }}
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Task Actions */}
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => onTaskEdit(task)}
//                     className={`p-2 rounded-lg transition-colors ${
//                       isDark
//                         ? "hover:bg-gray-700 text-blue-400 hover:text-blue-300"
//                         : "hover:bg-gray-100 text-blue-600 hover:text-blue-800"
//                     }`}
//                     title="Edit Task"
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     onClick={() => onTaskDelete(task._id)}
//                     className={`p-2 rounded-lg transition-colors ${
//                       isDark
//                         ? "hover:bg-gray-700 text-red-400 hover:text-red-300"
//                         : "hover:bg-gray-100 text-red-600 hover:text-red-800"
//                     }`}
//                     title="Delete Task"
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Expanded Details */}
//             {isExpanded && (
//               <div className={`px-4 pb-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
//                 {/* Tags */}
//                 {task.tags && task.tags.length > 0 && (
//                   <div className="mt-4">
//                     <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
//                       Tags:
//                     </span>
//                     <div className="flex flex-wrap gap-2">
//                       {task.tags.map((tag, index) => (
//                         <span
//                           key={index}
//                           className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Subtasks */}
//                 {task.subtasks && task.subtasks.length > 0 && (
//                   <div className="mt-4">
//                     <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
//                       Subtasks:
//                     </span>
//                     <div className="space-y-2">
//                       {task.subtasks.map((subtask, index) => (
//                         <div
//                           key={subtask._id}
//                           className={`flex items-center justify-between p-3 rounded-lg ${
//                             isDark
//                               ? "bg-gray-900/50"
//                               : "bg-gray-50"
//                           }`}
//                         >
//                           <div className="flex items-center gap-3">
//                             <div className={`w-4 h-4 rounded border flex items-center justify-center ${
//                               subtask.status === "completed"
//                                 ? "bg-green-500 border-green-500"
//                                 : isDark
//                                 ? "border-gray-600"
//                                 : "border-gray-400"
//                             }`}>
//                               {subtask.status === "completed" && (
//                                 <FaCheckCircle className="text-white text-xs" />
//                               )}
//                             </div>
//                             <div>
//                               <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} ${
//                                 subtask.status === "completed" ? "line-through opacity-60" : ""
//                               }`}>
//                                 {subtask.title}
//                               </span>
//                               {subtask.description && (
//                                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                   {subtask.description}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center gap-3">
//                             {subtask.estimatedHours > 0 && (
//                               <span className="text-xs text-gray-500 dark:text-gray-400">
//                                 {subtask.estimatedHours}h
//                               </span>
//                             )}
//                             {subtask.loggedHours > 0 && (
//                               <span className="text-xs text-gray-500 dark:text-gray-400">
//                                 ({subtask.loggedHours}h logged)
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default TaskList;