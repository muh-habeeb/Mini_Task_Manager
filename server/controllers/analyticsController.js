
const poolPromise = require('../config/database');

const getProductivityData = async (req, res) => {
    try {

        const userId = req.user?.userId; // use optional chaining to avoid crash if undefined
        const pool = await poolPromise;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: user ID missing' });
        }

        const { period = 'week' } = req.query;

        let dateFilter = '';
        switch (period) {
            case 'week':
                dateFilter = 'DATE(completed_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
                break;
            case 'month':
                dateFilter = 'DATE(completed_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
                break;
            case 'year':
                dateFilter = 'DATE(completed_at) >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)';
                break;
            default:
                dateFilter = 'DATE(completed_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
        }

        // Fetch task completion data
        const [completionData] = await pool.execute(`
            SELECT DATE(tl.completed_at) as date, COUNT(*) as count
            FROM task_logs tl
            WHERE tl.user_id = ? AND tl.action = 'completed' AND ${dateFilter}
            GROUP BY DATE(tl.completed_at)
            ORDER BY DATE(tl.completed_at)
        `, [userId]);

        const [statusData] = await pool.execute(`
            SELECT status, COUNT(*) as count
            FROM tasks
            WHERE user_id = ?
            GROUP BY status
        `, [userId]);

        const [priorityData] = await pool.execute(`
            SELECT priority, COUNT(*) as count
            FROM tasks
            WHERE user_id = ?
            GROUP BY priority
        `, [userId]);

        res.json({
            completionData,
            statusData,
            priorityData,
            req: "success"
        });
    } catch (error) {
        console.error('Analytics Error:', error); // ✅ See the actual error in terminal
        res.status(500).json({ error: 'Server error in analytics route' });
    }
};
module.exports = { getProductivityData };
