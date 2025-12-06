import Task from "../modal/Task.js";
import Project from "../modal/Project.js";

// Create a new task full task
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      priority,
      estimatedHours,
      dueDate,
      assignedTo,
      labels,
      subtasks,
      isPrivate,
    } = req.body;

    const userId = req.user.id; // From auth middleware

    // 1. Validate required fields
    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Title and projectId are required",
      });
    }

    // 2. Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only projectStartedBy or users in managingUserId can create tasks
    const isCreator = project.projectStartedBy.toString() === userId.toString();
    const isManager = project.managingUserId.some(
      (managerId) => managerId.toString() === userId.toString()
    );

    if (!isCreator && !isManager) {
      return res.status(403).json({
        success: false,
        message: "Only project creator or managers can create tasks",
      });
    }

    // 4. Validate assignee (if provided)
    if (assignedTo) {
      // Check if assignee is a team member (not suspended/removed)
      const isValidAssignee = project.teamMembers.some(
        (member) => member.toString() === assignedTo
      );

      if (!isValidAssignee) {
        return res.status(400).json({
          success: false,
          message: "Assignee must be an active team member of the project",
        });
      }
    }

    // 5. Validate due date
    let validatedDueDate = null;
    if (dueDate) {
      const due = new Date(dueDate);
      const projectStart = new Date(project.startDate);
      const projectEnd = new Date(project.endDate);

      if (due < projectStart) {
        return res.status(400).json({
          success: false,
          message: "Due date cannot be before project start date",
        });
      }

      if (due > projectEnd) {
        return res.status(400).json({
          success: false,
          message: "Due date cannot be after project end date",
        });
      }

      validatedDueDate = due;
    }

    // 6. Validate and prepare subtasks
    const validatedSubtasks = [];
    if (subtasks && Array.isArray(subtasks)) {
      for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];

        // Validate subtask title
        if (!subtask.title || subtask.title.trim() === "") {
          return res.status(400).json({
            success: false,
            message: `Subtask ${i + 1} must have a title`,
          });
        }

        // Validate subtask assignee (if provided)
        if (subtask.assignedTo) {
          const isSubtaskAssigneeValid = project.teamMembers.some(
            (member) => member.toString() === subtask.assignedTo
          );

          if (!isSubtaskAssigneeValid) {
            return res.status(400).json({
              success: false,
              message: `Assignee for subtask "${subtask.title}" must be a team member`,
            });
          }
        }

        // Prepare subtask object
        validatedSubtasks.push({
          title: subtask.title.trim(),
          description: subtask.description?.trim() || "",
          assignedTo: subtask.assignedTo || null,
          estimatedHours: subtask.estimatedHours || 0,
          status: "todo",
          order: i, // Maintain order from array
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // 7. Get next order number for the task
    const taskCount = await Task.countDocuments({ projectId });

    // 8. Create the task
    const taskData = {
      title: title.trim(),
      description: description?.trim() || "",
      projectId,
      priority: priority || "medium",
      estimatedHours: estimatedHours || 0,
      dueDate: validatedDueDate,
      assignedTo: assignedTo || null,
      labels: labels || [],
      subtasks: validatedSubtasks,
      isPrivate: isPrivate || false,
      createdBy: userId,
      status: "todo",
      order: taskCount,
    };

    const task = new Task(taskData);
    await task.save();

    // 9. Add task to project's tasks array
    project.tasks.push(task._id);
    await project.save();

    // 10. Return success response
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task: {
          _id: task._id,
          title: task.title,
          description: task.description,
          projectId: task.projectId,
          priority: task.priority,
          estimatedHours: task.estimatedHours,
          dueDate: task.dueDate,
          assignedTo: task.assignedTo,
          status: task.status,
          completionPercentage: task.completionPercentage || 0,
          totalSubtasks: task.subtasks.length,
          subtasks: task.subtasks.map((st) => ({
            _id: st._id,
            title: st.title,
            assignedTo: st.assignedTo,
            estimatedHours: st.estimatedHours,
            status: st.status,
          })),
          labels: task.labels,
          isPrivate: task.isPrivate,
          createdBy: task.createdBy,
          createdAt: task.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error creating task",
    });
  }
};

// Create quick task
export const createQuickTask = async (req, res) => {
  try {
    const { title, projectId } = req.body;
    const userId = req.user.id;

    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Title and projectId are required",
      });
    }

    // Check project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check user permissions
    const isCreator = project.projectStartedBy.toString() === userId.toString();
    const isManager = project.managingUserId.some(
      (managerId) => managerId.toString() === userId.toString()
    );

    if (!isCreator && !isManager) {
      return res.status(403).json({
        success: false,
        message: "Only project creator or managers can create tasks",
      });
    }

    // Get next order number
    const taskCount = await Task.countDocuments({ projectId });

    // Create minimal task
    const task = new Task({
      title: title.trim(),
      projectId,
      createdBy: userId,
      priority: "medium",
      status: "todo",
      order: taskCount,
    });

    await task.save();

    // Add to project
    project.tasks.push(task._id);
    await project.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task: {
          _id: task._id,
          title: task.title,
          projectId: task.projectId,
          status: task.status,
          createdBy: task.createdBy,
          createdAt: task.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Error creating quick task:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating task",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//get all the task for the user

// export const getTasks = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Get tasks where user is:
//     // 1. Assigned to task
//     // 2. Assigned to any subtask
//     // 3. Created the task
//     // 4. Is manager/creator of project
//     const tasks = await Task.find({
//       $or: [
//         { assignedTo: userId },
//         { "subtasks.assignedTo": userId },
//         { createdBy: userId },
//       ],
//     })
//       .populate("projectId", "name")
//       .populate("assignedTo", "firstName lastName")
//       .sort({ createdAt: -1 })
//       .limit(50);

//     res.json({
//       success: true,
//       count: tasks.length,
//       data: tasks,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      status, 
      priority, 
      projectId,
      limit = 50 
    } = req.query;

    // Build filter
    const filter = {
      $or: [
        { assignedTo: userId },
        { "subtasks.assignedTo": userId },
        { createdBy: userId }
      ]
    };

    // Add optional filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (projectId) filter.projectId = projectId;

    // Get tasks
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('projectId', 'name') // Just project name
      .lean();

    // Format response
    const formattedTasks = tasks.map(task => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      project: task.projectId ? {
        _id: task.projectId._id,
        name: task.projectId.name
      } : null,
      assignedTo: task.assignedTo,
      estimatedHours: task.estimatedHours,
      loggedHours: task.loggedHours,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      
      // Calculated fields
      completionPercentage: task.subtasks?.length > 0 
        ? Math.round((task.subtasks.filter(st => st.status === 'completed').length / task.subtasks.length) * 100)
        : (task.status === 'completed' ? 100 : 0),
      subtaskCount: task.subtasks?.length || 0,
      isOverdue: task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
    }));

    // Get statistics
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: formattedTasks.filter(t => t.isOverdue).length
    };

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: {
        tasks: formattedTasks,
        stats: stats,
        userRole: "All tasks you're involved with"
      }
    });

  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching tasks",
    });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    // 1. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // 2. Get the project for permission checks
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 3. Check permissions
    // Who can update? Project , Project managers, Task creator, Assigned user (for some fields)

    const isCreator = project.projectStartedBy.toString() === userId.toString();
    const isManager = project.managingUserId.some((manager) =>
      manager._id
        ? manager._id.toString() === userId.toString()
        : manager.toString() === userId.toString()
    );
    const isTaskCreator = task.createdBy.toString() === userId.toString();
    const isAssigned =
      task.assignedTo && task.assignedTo.toString() === userId.toString();

    const canUpdateAll = isCreator || isManager || isTaskCreator;
    const canUpdateAssigned = isAssigned;

    if (!canUpdateAll && !canUpdateAssigned) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this task",
      });
    }

    // 4. Define what fields each role can update
    const allowedFieldsForAll = [
      "title",
      "description",
      "priority",
      "estimatedHours",
      "dueDate",
      "assignedTo",
      "labels",
      "isPrivate",
      "order",
    ];

    const allowedFieldsForAssigned = [
      "status",
      "loggedHours",
      "workDescription",
    ];

    // 5. Filter updates based on permissions
    const filteredUpdates = {};

    Object.keys(updates).forEach((key) => {
      if (canUpdateAll && allowedFieldsForAll.includes(key)) {
        filteredUpdates[key] = updates[key];
      } else if (canUpdateAssigned && allowedFieldsForAssigned.includes(key)) {
        filteredUpdates[key] = updates[key];
      } else if (key === "status" && canUpdateAssigned) {
        // Assigned user can update status
        filteredUpdates[key] = updates[key];
      }
    });

    // 6. Special validation for assignee updates
    if (filteredUpdates.assignedTo) {
      const isValidAssignee = project.teamMembers.some(
        (member) => member.toString() === filteredUpdates.assignedTo
      );

      if (!isValidAssignee) {
        return res.status(400).json({
          success: false,
          message: "Assignee must be a team member of the project",
        });
      }
    }

    // 7. Special validation for due date
    if (filteredUpdates.dueDate) {
      const due = new Date(filteredUpdates.dueDate);
      const projectStart = new Date(project.startDate);
      const projectEnd = new Date(project.endDate);

      if (due < projectStart) {
        return res.status(400).json({
          success: false,
          message: "Due date cannot be before project start date",
        });
      }

      if (due > projectEnd) {
        return res.status(400).json({
          success: false,
          message: "Due date cannot be after project end date",
        });
      }
    }

    // 8. Special handling for status updates
    if (filteredUpdates.status === "completed" && !task.completedAt) {
      filteredUpdates.completedAt = new Date();
    } else if (filteredUpdates.status !== "completed" && task.completedAt) {
      filteredUpdates.completedAt = null;
    }

    // 9. Apply updates
    Object.keys(filteredUpdates).forEach((key) => {
      task[key] = filteredUpdates[key];
    });

    // 10. Save the task
    await task.save();

    // 11. Return updated task
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: {
        task: {
          _id: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assignedTo,
          estimatedHours: task.estimatedHours,
          loggedHours: task.loggedHours,
          dueDate: task.dueDate,
          completedAt: task.completedAt,
          completionPercentage: task.completionPercentage || 0,
          updatedAt: task.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating task",
    });
  }
};

// Update only task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      "todo",
      "in-progress",
      "review",
      "completed",
      "blocked",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Find the task
    const task = await Task.findById(taskId);
    console.log(status);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Get project for permission check
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check permissions - who can update status?
    const isCreator = project.projectStartedBy.toString() === userId.toString();
    const isManager = project.managingUserId.some((manager) =>
      manager._id
        ? manager._id.toString() === userId.toString()
        : manager.toString() === userId.toString()
    );
    const isTaskCreator = task.createdBy.toString() === userId.toString();
    const isAssigned =
      task.assignedTo && task.assignedTo.toString() === userId.toString();

    // Anyone related to task can update status
    const canUpdateStatus =
      isCreator || isManager || isTaskCreator || isAssigned;

    if (!canUpdateStatus) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update task status",
      });
    }

    // Update status
    const oldStatus = task.status;
    task.status = status;

    // Auto-set completedAt if marking as completed
    if (status === "completed" && !task.completedAt) {
      task.completedAt = new Date();
    } else if (status !== "completed" && task.completedAt) {
      task.completedAt = null;
    }

    // Auto-update subtask statuses if task is completed
    if (status === "completed" && task.subtasks.length > 0) {
      task.subtasks.forEach((subtask) => {
        if (subtask.status !== "completed") {
          subtask.status = "completed";
          subtask.completedAt = new Date();
        }
      });
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: `Task status updated from ${oldStatus} to ${status}`,
      data: {
        task: {
          _id: task._id,
          title: task.title,
          status: task.status,
          completedAt: task.completedAt,
          completionPercentage: task.completionPercentage || 0,
          updatedAt: task.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating task status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Get project for permission check
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only project creator or managers can delete tasks
    const isCreator = project.projectStartedBy.toString() === userId.toString();
    const isManager = project.managingUserId.some((manager) =>
      manager._id
        ? manager._id.toString() === userId.toString()
        : manager.toString() === userId.toString()
    );

    if (!isCreator && !isManager) {
      return res.status(403).json({
        success: false,
        message: "Only project creator or managers can delete tasks",
      });
    }

    // Check if task has logged hours (optional warning)
    const hasLoggedHours =
      task.loggedHours > 0 || task.subtasks.some((st) => st.loggedHours > 0);

    // Delete the task
    await Task.findByIdAndDelete(taskId);

    // Remove task from project's tasks array
    project.tasks = project.tasks.filter((t) => t.toString() !== taskId);
    await project.save();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: {
        deletedTaskId: taskId,
        warning: hasLoggedHours
          ? "Task had logged hours. This data has been permanently deleted."
          : undefined,
      },
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting task",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
