const User = require('../models/User');
const Assessment = require('../models/Assessment');
const formatResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');

/**
 * @desc    Delete user account and all associated data
 * @route   DELETE /api/user/delete-account
 * @access  Private
 */
exports.deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // 1. Delete all assessments related to user
        const result = await Assessment.deleteMany({ userId });
        logger.info(`Deleted ${result.deletedCount} assessments for user ${userId}`);

        // 2. Delete user
        await User.findByIdAndDelete(userId);

        // Clear cookie
        res.cookie('refreshToken', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        formatResponse(res, 200, 'Account and all data successfully deleted', null);
    } catch (error) {
        next(error);
    }
};
