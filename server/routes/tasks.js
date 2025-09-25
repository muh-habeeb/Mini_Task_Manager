const express = require('express');
const { body } = require('express-validator');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getTasks);

router.post('/', [
    body('title').notEmpty().withMessage('Title is required'),
    body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority')
], createTask);

router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;