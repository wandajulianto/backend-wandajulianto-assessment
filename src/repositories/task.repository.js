const Task = require('../models/task.model');

class TaskRepository {
  async createTask(taskData) {
    const task = new Task(taskData);
    await task.save();
    return task;
  }

  async findAllTasks(options) {
    const { status, priority, sortBy, limit, page } = options;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    const sort = {};
    if (sortBy) {
      const parts = sortBy.split(':'); // example: 'createdAt:desc'
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'username email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limit);

    return {
      tasks,
      page,
      limit,
      totalPages,
      totalTasks,
    };
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
