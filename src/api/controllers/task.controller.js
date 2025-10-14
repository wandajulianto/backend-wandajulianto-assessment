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
      const tasks = await taskService.getAllTasks();
      res.status(200).json({
        message: 'Sukses mendapatkan semua tugas',
        data: tasks
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
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
}

module.exports = new TaskController();
