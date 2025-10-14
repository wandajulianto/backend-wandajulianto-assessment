const taskRepository = require('../repositories/task.repository');

class TaskService {
  async createTask(taskData, userId) {
    // Add who created the task based on the logged in user
    const data = { ...taskData, assignedTo: userId };
    return await taskRepository.createTask(data);
  }

  async getAllTasks() {
    return await taskRepository.findAllTasks()
  }

  async getTaskById(id) {
    const task = await taskRepository.findTaskById(id);
    if (!task) {
      throw new Error('Tugas tidak ditemukan');
    }

    return task;
  }

  async updateTaskById(id, updateData) {
    const task = await taskRepository.updateTaskById(id, updateData);
    if (!task) {
      throw new Error('Tugas tidak ditemukan');
    }

    return task;
  }

  async deleteTaskById(id) {
    const task = await taskRepository.deleteTaskById(id);
    if (!task) {
      throw new Error('Tugas tidak ditemukan');
    }

    return { message: 'Tugas berhasil dihapus' };
  }
}

module.exports = new TaskService();
