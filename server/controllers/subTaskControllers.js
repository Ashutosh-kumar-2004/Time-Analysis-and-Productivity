import Project from "../modal/Project.js";
import Task from "../modal/Task.js";

// Add subtask to a task
export const addSubtask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const { 
      title, 
      description, 
      assignedTo, 
      estimatedHours 
    } = req.body;

    // 1. Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Subtask title is required"
      });
    }

    // 2. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // 3. Get project for permission check
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // 4. Check permissions
    // Who can add subtasks?
    // - Project creator
    // - Project managers  
    // - Task creator
    const isCreator = project.projectStartedBy.toString() === userId.toString();
    const isManager = project.managingUserId.some(manager =>
      manager._id ? manager._id.toString() === userId.toString() : manager.toString() === userId.toString()
    );
    const isTaskCreator = task.createdBy.toString() === userId.toString();

    if (!isCreator && !isManager && !isTaskCreator) {
      return res.status(403).json({
        success: false,
        message: "Only project creator, managers, or task creator can add subtasks"
      });
    }

    // 5. Validate assignee (if provided)
    if (assignedTo) {
      const isValidAssignee = project.teamMembers.some(member =>
        member.toString() === assignedTo
      );
      
      if (!isValidAssignee) {
        return res.status(400).json({
          success: false,
          message: "Assignee must be a team member of the project"
        });
      }
    }

    // 6. Create subtask object
    const newSubtask = {
      title: title.trim(),
      description: description?.trim() || '',
      assignedTo: assignedTo || null,
      estimatedHours: estimatedHours || 0,
      status: 'todo',
      order: task.subtasks.length, // Add to end
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: []
    };

    // 7. Add to task's subtasks array
    task.subtasks.push(newSubtask);
    
    // 8. Update task's estimated hours if subtask has hours
    if (estimatedHours > 0) {
      task.estimatedHours = (task.estimatedHours || 0) + estimatedHours;
    }

    // 9. Save the task
    await task.save();

    // 10. Get the newly created subtask (last in array)
    const createdSubtask = task.subtasks[task.subtasks.length - 1];

    res.status(201).json({
      success: true,
      message: "Subtask added successfully",
      data: {
        subtask: {
          _id: createdSubtask._id,
          title: createdSubtask.title,
          description: createdSubtask.description,
          assignedTo: createdSubtask.assignedTo,
          estimatedHours: createdSubtask.estimatedHours,
          status: createdSubtask.status,
          order: createdSubtask.order
        },
        task: {
          _id: task._id,
          title: task.title,
          totalSubtasks: task.subtasks.length,
          estimatedHours: task.estimatedHours
        }
      }
    });

  } catch (error) {
    console.error("Error adding subtask:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding subtask",
    });
  }
};

// Update a subtask
export const updateSubtask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    // 1. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // 2. Find the subtask
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found"
      });
    }

    // 3. Get project for permission check
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // 4. Check permissions
    // Who can update subtasks?
    // - Project creator
    // - Project managers
    // - Task creator
    // - Subtask assignee
    const isCreator = project.projectStartedBy.toString() === userId.toString();
    const isManager = project.managingUserId.some(manager =>
      manager._id ? manager._id.toString() === userId.toString() : manager.toString() === userId.toString()
    );
    const isTaskCreator = task.createdBy.toString() === userId.toString();
    const isSubtaskAssignee = subtask.assignedTo && subtask.assignedTo.toString() === userId.toString();

    const canUpdateAll = isCreator || isManager || isTaskCreator;
    const canUpdateAssigned = isSubtaskAssignee;

    if (!canUpdateAll && !canUpdateAssigned) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this subtask"
      });
    }

    // 5. Define allowed fields for each role
    const allowedFieldsForAll = [
      'title', 'description', 'assignedTo', 'estimatedHours', 'order'
    ];

    const allowedFieldsForAssignee = [
      'status', 'loggedHours', 'workNotes'
    ];

    // 6. Filter updates based on permissions
    const filteredUpdates = {};
    const originalEstimatedHours = subtask.estimatedHours || 0;
    
    Object.keys(updates).forEach(key => {
      if (canUpdateAll && allowedFieldsForAll.includes(key)) {
        filteredUpdates[key] = updates[key];
      } else if (canUpdateAssigned && allowedFieldsForAssignee.includes(key)) {
        filteredUpdates[key] = updates[key];
      } else if (key === 'status' && canUpdateAssigned) {
        // Assignee can update their own subtask status
        filteredUpdates[key] = updates[key];
      }
    });

    // 7. Validate assignee (if being updated)
    if (filteredUpdates.assignedTo) {
      const isValidAssignee = project.teamMembers.some(member =>
        member.toString() === filteredUpdates.assignedTo
      );
      
      if (!isValidAssignee) {
        return res.status(400).json({
          success: false,
          message: "Assignee must be a team member of the project"
        });
      }
    }

    // 8. Apply updates to subtask
    Object.keys(filteredUpdates).forEach(key => {
      subtask[key] = filteredUpdates[key];
    });

    // 9. Handle special cases
    // Update subtask updatedAt
    subtask.updatedAt = new Date();

    // Auto-set completedAt for subtask completion
    if (filteredUpdates.status === 'completed' && !subtask.completedAt) {
      subtask.completedAt = new Date();
    } else if (filteredUpdates.status !== 'completed' && subtask.completedAt) {
      subtask.completedAt = null;
    }

    // 10. Update task's estimated hours if subtask hours changed
    if (filteredUpdates.estimatedHours !== undefined) {
      const newEstimatedHours = filteredUpdates.estimatedHours || 0;
      const hoursDifference = newEstimatedHours - originalEstimatedHours;
      
      if (hoursDifference !== 0) {
        task.estimatedHours = (task.estimatedHours || 0) + hoursDifference;
      }
    }

    // 11. Auto-update task status based on subtasks
    if (filteredUpdates.status) {
      const allSubtasksCompleted = task.subtasks.every(st => st.status === 'completed');
      const someSubtasksCompleted = task.subtasks.some(st => st.status === 'completed');
      
      if (allSubtasksCompleted) {
        task.status = 'completed';
        task.completedAt = task.completedAt || new Date();
      } else if (someSubtasksCompleted && task.status === 'todo') {
        task.status = 'in-progress';
      }
    }

    // 12. Save the task
    await task.save();

    // 13. Return response
    res.status(200).json({
      success: true,
      message: "Subtask updated successfully",
      data: {
        subtask: {
          _id: subtask._id,
          title: subtask.title,
          description: subtask.description,
          assignedTo: subtask.assignedTo,
          estimatedHours: subtask.estimatedHours,
          loggedHours: subtask.loggedHours,
          status: subtask.status,
          completedAt: subtask.completedAt,
          order: subtask.order,
          updatedAt: subtask.updatedAt
        },
        task: {
          _id: task._id,
          title: task.title,
          status: task.status,
          estimatedHours: task.estimatedHours,
          completionPercentage: task.completionPercentage || 0
        }
      }
    });

  } catch (error) {
    console.error("Error updating subtask:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating subtask",
    });
  }
};

// Delete a subtask
export const deleteSubtask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const userId = req.user.id;

    // 1. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // 2. Find the subtask
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found"
      });
    }

    // 3. Get project for permission check
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // 4. Check permissions
    // Only project creator, managers, or task creator can delete subtasks
    // (Assigned users CANNOT delete subtasks)
    const isCreator = project.projectStartedBy.toString() === userId.toString();
    const isManager = project.managingUserId.some(manager =>
      manager._id ? manager._id.toString() === userId.toString() : manager.toString() === userId.toString()
    );
    const isTaskCreator = task.createdBy.toString() === userId.toString();

    if (!isCreator && !isManager && !isTaskCreator) {
      return res.status(403).json({
        success: false,
        message: "Only project creator, managers, or task creator can delete subtasks"
      });
    }

    // 5. Store subtask info before deletion
    const deletedSubtask = {
      title: subtask.title,
      estimatedHours: subtask.estimatedHours || 0,
      loggedHours: subtask.loggedHours || 0,
      hasComments: subtask.comments && subtask.comments.length > 0,
      commentCount: subtask.comments ? subtask.comments.length : 0
    };

    // 6. Remove subtask from array
    task.subtasks.pull(subtaskId);

    // 7. Update task's estimated hours (subtract deleted subtask's hours)
    if (deletedSubtask.estimatedHours > 0) {
      task.estimatedHours = Math.max(0, (task.estimatedHours || 0) - deletedSubtask.estimatedHours);
    }

    // 8. Update task's logged hours (subtract deleted subtask's logged hours)
    if (deletedSubtask.loggedHours > 0) {
      task.loggedHours = Math.max(0, (task.loggedHours || 0) - deletedSubtask.loggedHours);
    }

    // 9. Recalculate task status based on remaining subtasks
    if (task.subtasks.length === 0) {
      // No subtasks left, task status depends on its own status
      if (task.status === 'completed') {
        // Keep as completed
      } else {
        task.status = 'todo';
      }
    } else {
      // Check if all remaining subtasks are completed
      const allCompleted = task.subtasks.every(st => st.status === 'completed');
      const someCompleted = task.subtasks.some(st => st.status === 'completed');
      
      if (allCompleted) {
        task.status = 'completed';
        task.completedAt = task.completedAt || new Date();
      } else if (someCompleted && task.status === 'todo') {
        task.status = 'in-progress';
        task.completedAt = null;
      } else if (!someCompleted && task.status !== 'todo') {
        task.status = 'todo';
        task.completedAt = null;
      }
    }

    // 10. Reorder remaining subtasks (fix gaps)
    task.subtasks.forEach((st, index) => {
      st.order = index;
    });

    // 11. Save the task
    await task.save();

    // 12. Return success response
    res.status(200).json({
      success: true,
      message: "Subtask deleted successfully",
      data: {
        deletedSubtask: {
          title: deletedSubtask.title,
          estimatedHours: deletedSubtask.estimatedHours,
          loggedHours: deletedSubtask.loggedHours,
          hadComments: deletedSubtask.hasComments,
          commentCount: deletedSubtask.commentCount
        },
        task: {
          _id: task._id,
          title: task.title,
          remainingSubtasks: task.subtasks.length,
          estimatedHours: task.estimatedHours,
          loggedHours: task.loggedHours,
          status: task.status,
          completionPercentage: task.completionPercentage || 0
        }
      }
    });

  } catch (error) {
    console.error("Error deleting subtask:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting subtask",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Log hours worked on a subtask
export const logSubtaskHours = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const userId = req.user.id;
    const { hours, notes } = req.body;

    // 1. Validate input
    if (!hours || typeof hours !== 'number' || hours <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid hours (number > 0) is required"
      });
    }

    // Optional: Limit max hours per entry (e.g., 24 hours)
    const MAX_HOURS_PER_ENTRY = 24;
    if (hours > MAX_HOURS_PER_ENTRY) {
      return res.status(400).json({
        success: false,
        message: `Cannot log more than ${MAX_HOURS_PER_ENTRY} hours at once`
      });
    }

    // 2. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // 3. Find the subtask
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found"
      });
    }

    // 4. Check permissions
    // ONLY the assigned user can log hours to their own subtask
    // (Trust-based system - user reports their own work)
    const isAssigned = subtask.assignedTo && subtask.assignedTo.toString() === userId.toString();
    
    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: "Only the assigned user can log hours to this subtask"
      });
    }

    // 5. Get previous hours for calculations
    const previousSubtaskHours = subtask.loggedHours || 0;
    const previousTaskHours = task.loggedHours || 0;

    // 6. Update subtask hours
    subtask.loggedHours = previousSubtaskHours + hours;
    
    // 7. Update subtask work notes (append or replace)
    if (notes && notes.trim() !== '') {
      if (subtask.workNotes && subtask.workNotes.trim() !== '') {
        // Append to existing notes
        subtask.workNotes = `${subtask.workNotes}\n\n${new Date().toLocaleDateString()}: ${notes.trim()}`;
      } else {
        // Set new notes
        subtask.workNotes = `${new Date().toLocaleDateString()}: ${notes.trim()}`;
      }
    }

    // 8. Update subtask status if it was "todo"
    if (subtask.status === 'todo' && hours > 0) {
      subtask.status = 'in-progress';
    }

    // 9. Update subtask updatedAt
    subtask.updatedAt = new Date();

    // 10. Update task's total logged hours
    task.loggedHours = previousTaskHours + hours;

    // 11. Update task status if needed
    if (task.status === 'todo' && hours > 0) {
      task.status = 'in-progress';
    }

    // 12. Calculate efficiency score (optional analytics)
    const efficiencyScore = subtask.estimatedHours > 0 
      ? Math.round((subtask.estimatedHours / (subtask.loggedHours || 1)) * 100) 
      : null;

    // 13. Save the task
    await task.save();

    // 14. Return success response
    res.status(200).json({
      success: true,
      message: "Hours logged successfully",
      data: {
        timeEntry: {
          subtaskId: subtask._id,
          hoursLogged: hours,
          totalSubtaskHours: subtask.loggedHours,
          notes: notes || '',
          loggedAt: new Date()
        },
        subtask: {
          _id: subtask._id,
          title: subtask.title,
          assignedTo: subtask.assignedTo,
          estimatedHours: subtask.estimatedHours,
          loggedHours: subtask.loggedHours,
          status: subtask.status,
          workNotes: subtask.workNotes,
          updatedAt: subtask.updatedAt
        },
        task: {
          _id: task._id,
          title: task.title,
          loggedHours: task.loggedHours,
          status: task.status
        },
        analytics: {
          hoursAdded: hours,
          totalTaskHours: task.loggedHours,
          efficiencyScore: efficiencyScore,
          efficiencyMessage: efficiencyScore ? 
            (efficiencyScore > 100 ? `${efficiencyScore - 100}% ahead of estimate` :
             efficiencyScore < 100 ? `${100 - efficiencyScore}% behind estimate` :
             "Right on estimate!") : "No estimate to compare"
        }
      }
    });

  } catch (error) {
    console.error("Error logging subtask hours:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error logging hours",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};