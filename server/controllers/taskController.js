const { validationResult } = require('express-validator');
const poolPromise = require('../config/database');

const getTasks = async (req, res) => {
    try {
        const pool = await poolPromise;

        const userId = req.user.userId;
        const { status, priority, sort = 'created_at', order = 'DESC' } = req.query;

        let query = 'SELECT * FROM tasks WHERE user_id = ?';
        const params = [userId];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (priority) {
            query += ' AND priority = ?';
            params.push(priority);
        }

        query += ` ORDER BY ${sort} ${order}`;

        const [tasks] = await pool.execute(query, params);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const createTask = async (req, res) => {
    try {

        const pool = await poolPromise;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.userId;
        const { title, description, due_date, priority } = req.body;

        const [result] = await pool.execute(
            'INSERT INTO tasks (user_id, title, description, due_date, priority) VALUES (?, ?, ?, ?, ?)',
            [userId, title, description, due_date, priority]
        );

        res.status(201).json({
            message: 'Task created successfully',
            taskId: result.insertId
        });
    } catch (error) {
        console.error('Error in createTask:', error); // Add this line
        res.status(500).json({ error: 'Server error' });
    }

};

const updateTask = async (req, res) => {
    try {
        const pool = await poolPromise;
        const userId = req.user.userId;
        const taskId = req.params.id;
        const { title, description, due_date, priority, status } = req.body;

        if (!title || !description || !due_date || !priority || !status) {
            return res.status(400).json({ error: 'Missing required task fields' });
        }
        const [tasks] = await pool.execute(
            'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
            [taskId, userId]
        );

        if (tasks.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (status === 'Completed') {
            await pool.execute(
                'INSERT INTO task_logs (task_id, user_id, action) VALUES (?, ?, ?)',
                [taskId, userId, 'completed']
            );
        }

        await pool.execute(
            'UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, status = ? WHERE id = ? AND user_id = ?',
            [title, description, due_date, priority, status, taskId, userId]
        );

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const pool = await poolPromise;
        const userId = req.user.userId;
        const taskId = req.params.id;

        const [result] = await pool.execute(
            'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            [taskId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };