const Task = require('../models/Task');
const Activity = require('../models/Activity');

// @desc    Get all tasks for the logged in user (with search, status, priority, date filters & sorting)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, date, sortBy, sortOrder } = req.query;

    // Filter by logged-in user
    const query = { user: req.user._id };

    // Search by title or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Filter by status if provided (All / Pending / In Progress / Completed)
    if (status && status !== 'All' && status !== 'All Status') {
      query.status = status;
    }

    // Filter by priority if provided (All / High / Medium / Low)
    if (priority && priority !== 'All' && priority !== 'All Priority') {
      query.priority = priority;
    }

    // Filter by specific day (Calendar view)
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    }

    // Sorting
    const sort = {};
    if (sortBy === 'dueDate' || sortBy === 'Due Date') {
      sort.dueDate = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'priority' || sortBy === 'Priority') {
      // Map priority sorting
      sort.priority = 1;
    } else if (sortBy === 'title' || sortBy === 'Title') {
      sort.title = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // newest first by default
    }

    const tasks = await Task.find(query).sort(sort);

    // Compute summary stats for dashboard
    const allUserTasks = await Task.find({ user: req.user._id });
    const totalCount = allUserTasks.length;
    const pendingCount = allUserTasks.filter((t) => t.status === 'Pending').length;
    const inProgressCount = allUserTasks.filter((t) => t.status === 'In Progress').length;
    const completedCount = allUserTasks.filter((t) => t.status === 'Completed').length;

    const highPriorityCount = allUserTasks.filter((t) => t.priority === 'High').length;
    const mediumPriorityCount = allUserTasks.filter((t) => t.priority === 'Medium').length;
    const lowPriorityCount = allUserTasks.filter((t) => t.priority === 'Low').length;

    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      count: tasks.length,
      stats: {
        total: totalCount,
        pending: pendingCount,
        inProgress: inProgressCount,
        completed: completedCount,
        completionRate,
        byPriority: {
          high: highPriorityCount,
          medium: mediumPriorityCount,
          low: lowPriorityCount,
        },
      },
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignee } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description: description || '',
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      assignee: assignee || req.user.name,
    });

    // Record activity
    await Activity.create({
      user: req.user._id,
      taskTitle: task.title,
      action: 'created',
      type: 'created',
      details: `Task "${task.title}" created`,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const existingTask = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied',
      });
    }

    const previousStatus = existingTask.status;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // Check if status changed
    if (req.body.status && req.body.status !== previousStatus) {
      const typeMap = {
        'Completed': 'completed',
        'In Progress': 'in_progress',
        'Pending': 'pending',
      };
      await Activity.create({
        user: req.user._id,
        taskTitle: task.title,
        action: 'status_changed',
        type: typeMap[req.body.status] || 'updated',
        details: `Task "${task.title}" moved to ${req.body.status}`,
      });
    } else {
      await Activity.create({
        user: req.user._id,
        taskTitle: task.title,
        action: 'updated',
        type: 'updated',
        details: `Task "${task.title}" updated`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied',
      });
    }

    // Record activity
    await Activity.create({
      user: req.user._id,
      taskTitle: task.title,
      action: 'deleted',
      type: 'deleted',
      details: `Task "${task.title}" deleted`,
    });

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
