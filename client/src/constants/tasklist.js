export const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "critical":
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800";
    case "high":
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800";
    case "medium":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
    case "low":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
  }
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    case "in-progress":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
    case "todo":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
  }
};
