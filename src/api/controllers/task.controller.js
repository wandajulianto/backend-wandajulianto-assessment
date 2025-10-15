const taskService = require('../../services/task.service');

// Wrapper to handle async errors without needing try-catch in every method
const catchAsync = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

class TaskController {
  createTask = catchAsync(async (req, res, next) => {
    const task = await taskService.createTask(req.body, req.user.id);
    res.status(201).json({
      message: 'Tugas berhasil dibuat',
      data: task,
    });
  });

  getAllTasks = catchAsync(async (req, res, next) => {
    const options = {
      status: req.query.status,
      priority: req.query.priority,
      sortBy: req.query.sortBy,
      limit: parseInt(req.query.limit, 10) || 10, // Default limit 10
      page: parseInt(req.query.page, 10) || 1, // Default page 1
    };
    const result = await taskService.getAllTasks(options);
    res.status(200).json(result);
  });

  getTaskById = catchAsync(async (req, res, next) => {
    const task = await taskService.getTaskById(req.params.id);
    res.status(200).json({
      message: 'Sukses mendapatkan tugas berdasarkan id',
      data: task
    });
  });

  updateTaskById = catchAsync(async (req, res, next) => {
    const task = await taskService.updateTaskById(req.params.id, req.body);
    res.status(200).json({
      message: 'Sukses mengubah tugas',
      data: task
    });
  });

  deleteTaskById = catchAsync(async (req, res, next) => {
    const result = await taskService.deleteTaskById(req.params.id);
    res.status(200).json(result);
  });

  uploadAttachment = catchAsync(async (req, res, next) => {
    const task = await taskService.addTaskAttachment(req.params.id, req.file);
    res.status(200).json({
      message: 'Sukses menambahkan file',
      data: task
    });
  });
}

module.exports = new TaskController();
