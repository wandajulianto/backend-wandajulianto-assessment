const express = require('express');
const taskController = require('../controllers/task.controller');
const protect = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const router = express.Router();

// Apply the 'protect' middleware to all routes below
router.use(protect);

router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTaskById);
router.delete('/:id', taskController.deleteTaskById);

// Use .single('attachment') where 'attachment' is the field name in the form data
router.post('/:id/attachments', upload.single('attachment'), taskController.uploadAttachment);

module.exports = router;
