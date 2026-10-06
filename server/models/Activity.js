const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    taskTitle: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      enum: ['created', 'updated', 'status_changed', 'deleted'],
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['completed', 'in_progress', 'pending', 'created', 'deleted'],
      default: 'created',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Activity', activitySchema);
