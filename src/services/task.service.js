const taskRepository = require('../repositories/task.repository');
const ErrorHandler = require('../utils/errorHandler');

class TaskService {
  async createTask(taskData, userId) {
    // Add who created the task based on the logged in user
    const data = { ...taskData, assignedTo: userId };
    return await taskRepository.createTask(data);
  }

  async getAllTasks(options) {
    return await taskRepository.findAllTasks(options)
  }

  async getTaskById(id) {
    const task = await taskRepository.findTaskById(id);
    if (!task) {
      throw new ErrorHandler(404, 'Tugas tidak ditemukan');
    }

    return task;
  }

  async updateTaskById(id, updateData) {
    const task = await taskRepository.updateTaskById(id, updateData);
    if (!task) {
      throw new ErrorHandler(404, 'Tugas tidak ditemukan');
    }

    return task;
  }

  async deleteTaskById(id) {
    const task = await taskRepository.deleteTaskById(id);
    if (!task) {
      throw new ErrorHandler(404, 'Tugas tidak ditemukan');
    }

    return { message: 'Tugas berhasil dihapus' };
  }

  async addTaskAttachment(taskId, file) {
    if (!file) {
      throw new ErrorHandler(404, 'File tidak ditemukan');
    }

    // Save path file, not the file itself
    const attachmentPath = file.path;
    return await taskRepository.updateTaskById(taskId, { attachments: attachmentPath });
  }
}

module.exports = new TaskService();
