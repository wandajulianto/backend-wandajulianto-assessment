const taskService = require('../../services/task.service');

class TaskController {
  async createTask(req, res, next) {
    try {
      // req.user.id from 'protect' middleware
      const task = await taskService.createTask(req.body, req.user.id);
      res.status(201).json({
        message: 'Tugas berhasil dibuat',
        data: task,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllTasks(req, res, next) {
    try {
      // Get query params from URL
      const options = {
        status: req.query.status,
        priority: req.query.priority,
        sortBy: req.query.sortBy,
        limit: parseInt(req.query.limit, 10) || 10, // Default limit 10
        page: parseInt(req.query.page, 10) || 1, // Default page 1
      };
      const result = await taskService.getAllTasks(options);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTaskById(req, res, next) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      res.status(200).json({
        message: 'Sukses mendapatkan tugas berdasarkan id',
        data: task
      })
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateTaskById(req, res, next) {
    try {
      const task = await taskService.updateTaskById(req.params.id, req.body);
      res.status(200).json({
        message: 'Sukses mengubah tugas',
        data: task
      })
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteTaskById(req, res, next) {
    try {
      const result = await taskService.deleteTaskById(req.params.id);
      res.status(200).json(result)
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async uploadAttachment(req, res, next) {
    try {
      const task = await taskService.addTaskAttachment(req.params.id, req.file);
      res.status(200).json({
        message: 'Sukses menambahkan file',
        data: task
      })
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new TaskController();
