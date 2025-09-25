const pool = require('../config/database');

class TaskLog {
    constructor(taskId, userId, action) {
        this.taskId = taskId;
        this.userId = userId;
        this.action = action;
        this.completedAt = new Date();
    }

    static async createLog(taskId, userId, action) {
        const log = new TaskLog(taskId, userId, action);
        const [result] = await pool.execute(
            'INSERT INTO task_logs (task_id, user_id, action, completed_at) VALUES (?, ?, ?, ?)',
            [log.taskId, log.userId, log.action, log.completedAt]
        );
        return result.insertId;
    }

    static async getLogsByTaskId(taskId) {
        const [logs] = await pool.execute(
            'SELECT * FROM task_logs WHERE task_id = ?',
            [taskId]
        );
        return logs;
    }

    static async getLogsByUserId(userId) {
        const [logs] = await pool.execute(
            'SELECT * FROM task_logs WHERE user_id = ?',
            [userId]
        );
        return logs;
    }
}

module.exports = TaskLog;