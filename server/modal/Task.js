import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    unique: true
  },
  taskName: {
    type: String,
    required: true
  },
  taskPriority: {
    type: String,
    enum: ['high', 'medium', 'low',"critical"],
    default: 'low'
  },
  workingMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  taskTotalDuration: {
    type: Number, // in minutes
    default: 0
  },
  completedMinutes: {
    type: Number, // in minutes
    default: 0
  },
  commands: [{
    type: String
  }],
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for task duration
taskSchema.virtual('duration').get(function() {
  return this.taskAssociation;
});

// Middleware
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Task', taskSchema);