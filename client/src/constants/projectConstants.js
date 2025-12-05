// Get status badge styles
export const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "started":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
    case "in progress":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
    case "completed":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    default:
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
  }
};

// Get status icon
export const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "started":
      return "🚀";
    case "in progress":
      return "🔄";
    case "completed":
      return "✅";
    default:
      return "📁";
  }
};

// Get priority badge styles
export const getPriorityStyles = (priority) => {
  switch (priority?.toLowerCase()) {
    case "low":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    case "medium":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
    case "high":
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
    case "critical":
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
    default:
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
  }
};

// Get priority icon
export const getPriorityIcon = (priority) => {
  switch (priority?.toLowerCase()) {
    case "low":
      return "⬇️";
    case "medium":
      return "➡️";
    case "high":
      return "⬆️";
    case "critical":
      return "🚨";
    default:
      return "📊";
  }
};

// Get project card background based on status
export const getCardBackground = (isArchived, status) => {
  if (isArchived) {
    return "bg-gray-50 dark:bg-gray-800/50";
  }

  switch (status?.toLowerCase()) {
    case "started":
      return "bg-white dark:bg-gray-900";
    case "in progress":
      return "bg-white dark:bg-gray-900";
    case "completed":
      return "bg-white dark:bg-gray-900";
    default:
      return "bg-white dark:bg-gray-900";
  }
};

// Get border color based on status
export const getBorderColor = (isArchived, status) => {
  if (isArchived) {
    return "border-gray-300 dark:border-gray-700";
  }

  switch (status?.toLowerCase()) {
    case "started":
      return "border-blue-200 dark:border-blue-800";
    case "in progress":
      return "border-yellow-200 dark:border-yellow-800";
    case "completed":
      return "border-green-200 dark:border-green-800";
    default:
      return "border-gray-200 dark:border-gray-800";
  }
};

// Check if user is a manager (has permission to archive/restore)
export const isUserManager = (project, currentUserId) => {
  if (!currentUserId || !project) return false;
  
  // Check if user is in managingUserId array
  const isInManagingUsers = project.managingUserId?.some(
    manager => manager._id === currentUserId
  );
  
  // Check if user is the project starter
  const isProjectStarter = project.projectStartedBy?._id === currentUserId;
  
  return isInManagingUsers || isProjectStarter;
};

// Get manager name
export const getManagerName = (project) => {
  if (project.managingUserId?.length > 0) {
    const manager = project.managingUserId[0];
    return `${manager.firstName} ${manager.lastName}`;
  }
  if (project.projectStartedBy) {
    return `${project.projectStartedBy.firstName} ${project.projectStartedBy.lastName}`;
  }
  return "No manager";
};

// Get user's role in project
export const getUserRole = (project, currentUserId) => {
  if (!currentUserId || !project) return "viewer";
  
  if (project.managingUserId?.some(manager => manager._id === currentUserId)) {
    return "manager";
  }
  
  if (project.projectStartedBy?._id === currentUserId) {
    return "creator";
  }
  
  if (project.teamMembers?.some(member => member._id === currentUserId)) {
    return "member";
  }
  
  return "viewer";
};