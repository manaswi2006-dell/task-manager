const Activity = require('../models/Activity');

// @desc    Get user's recent activity stream
// @route   GET /api/activity
// @access  Private
const getRecentActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      message: 'Activities fetched successfully',
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecentActivities,
};
