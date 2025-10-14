const express = require('express');
const taskController = require('../controllers/task.controller');
const protect = require('../middlewares/auth.middleware');
const router = express.Router();

// Apply the 'protect' middleware to all routes below
router.use(protect);

router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTaskById);
router.delete('/:id', taskController.deleteTaskById);

module.exports = router;
