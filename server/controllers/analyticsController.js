const Assessment = require('../models/Assessment');
const formatResponse = require('../utils/responseFormatter');

/**
 * @desc    Get user stress trends
 * @route   GET /api/trends
 * @access  Private
 */
exports.getUserTrends = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Calculate date ranges
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Fetch last 30 days of assessments for the user
        const assessments = await Assessment.find({
            userId,
            createdAt: { $gte: thirtyDaysAgo }
        }).sort({ createdAt: 1 }).lean();

        if (!assessments.length) {
            return formatResponse(res, 200, 'No data available', {
                last7DaysAvg: null,
                last30DaysAvg: null,
                changePercentage: null,
                dominantCluster: null,
                totalAssessments: 0,
                history: []
            });
        }

        // Calculate averages
        const last7DaysData = assessments.filter(a => new Date(a.createdAt) >= sevenDaysAgo);

        const calcAvg = (data) => data.length ? Math.round(data.reduce((acc, a) => acc + a.score, 0) / data.length) : null;

        const last7DaysAvg = calcAvg(last7DaysData);
        const last30DaysAvg = calcAvg(assessments);

        let changePercentage = null;
        if (last7DaysAvg !== null && last30DaysAvg !== null && last30DaysAvg !== 0) {
            changePercentage = Math.round(((last7DaysAvg - last30DaysAvg) / last30DaysAvg) * 100);
        }

        // Find dominant cluster in last 7 days (or 30 if no 7 day data)
        const targetData = last7DaysData.length ? last7DaysData : assessments;
        const clusterSums = { Work: 0, Emotional: 0, Physical: 0, Social: 0 };

        targetData.forEach(a => {
            if (a.clusterScores) {
                clusterSums.Work += a.clusterScores.Work || 0;
                clusterSums.Emotional += a.clusterScores.Emotional || 0;
                clusterSums.Physical += a.clusterScores.Physical || 0;
                clusterSums.Social += a.clusterScores.Social || 0;
            }
        });

        let dominantCluster = null;
        let maxScore = -1;
        for (const [cluster, score] of Object.entries(clusterSums)) {
            if (score > maxScore && score > 0) {
                maxScore = score;
                dominantCluster = cluster;
            }
        }

        formatResponse(res, 200, 'Trends fetched successfully', {
            last7DaysAvg,
            last30DaysAvg,
            changePercentage,
            dominantCluster,
            totalAssessments: assessments.length,
            history: assessments.map(a => ({
                _id: a._id,
                date: a.createdAt,
                score: a.score,
                level: a.level,
                analysis: a.analysis,
                personalizedTips: a.personalizedTips,
                clusterScores: a.clusterScores,
                disclaimer: "This is a past assessment from your history."
            }))
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get admin analytics (Anonymized overall data)
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
exports.getAdminAnalytics = async (req, res, next) => {
    try {
        const totalAssessments = await Assessment.countDocuments();
        const totalUsers = await require('../models/User').countDocuments();

        // Aggregate average score across platform
        const avgScoreAgg = await Assessment.aggregate([
            { $group: { _id: null, avgScore: { $avg: "$score" } } }
        ]);

        const platformAvgScore = avgScoreAgg.length ? Math.round(avgScoreAgg[0].avgScore) : 0;

        formatResponse(res, 200, 'Admin analytics fetched', {
            totalAssessments,
            totalUsers,
            platformAvgScore
        });
    } catch (error) {
        next(error);
    }
};
