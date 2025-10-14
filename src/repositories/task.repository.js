const Task = require('../models/task.model');

class TaskRepository {
  async createTask(taskData) {
    const task = new Task(taskData);
    await task.save();
    return task;
  }

  async findAllTasks() {
    // TODO: Filter and pagination will be added later
    return await Task.find().populate('assignedTo', 'username email');
  }

  async findTaskById(id) {
    return await Task.findById(id).populate('assignedTo', 'username email');
  }

  async updateTaskById(id, updateData) {
    return await Task.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteTaskById(id) {
    return await Task.findByIdAndDelete(id);
  }
}

module.exports = new TaskRepository();
