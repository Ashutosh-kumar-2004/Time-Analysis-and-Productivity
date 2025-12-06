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