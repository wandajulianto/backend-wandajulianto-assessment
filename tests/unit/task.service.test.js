const taskService = require('../../src/services/task.service');
const taskRepository = require('../../src/repositories/task.repository');
const ErrorHandler = require('../../src/utils/errorHandler');

jest.mock('../../src/repositories/task.repository');

describe('Task Service 🧪', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task and assign it to the correct user', async () => {
      const taskData = { title: 'New Task', description: 'A cool task' };
      const userId = 'user-123';
      const createdTask = { ...taskData, assignedTo: userId, _id: 'task-abc' };

      taskRepository.createTask.mockResolvedValue(createdTask);

      const result = await taskService.createTask(taskData, userId);

      expect(result).toEqual(createdTask);
      expect(taskRepository.createTask).toHaveBeenCalledWith({
        ...taskData,
        assignedTo: userId,
      });
      expect(taskRepository.createTask).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllTasks', () => {
    it('should call repository and return a list of tasks with pagination', async () => {
      const mockResult = {
        tasks: [{ title: 'Task 1' }, { title: 'Task 2' }],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalTasks: 2,
      };

      taskRepository.findAllTasks.mockResolvedValue(mockResult);

      const result = await taskService.getAllTasks({}); // Opsi kosong

      expect(result).toEqual(mockResult);
      expect(taskRepository.findAllTasks).toHaveBeenCalledWith({});
    });
  });

  describe('getTaskById', () => {
    it('should return a task if a valid ID is provided', async () => {
      const mockTask = { _id: 'taskId123', title: 'Test Task' };
      taskRepository.findTaskById.mockResolvedValue(mockTask);

      const task = await taskService.getTaskById('taskId123');

      expect(task).toEqual(mockTask);
      expect(taskRepository.findTaskById).toHaveBeenCalledWith('taskId123');
    });

    it('should throw an ErrorHandler if task is not found', async () => {
      taskRepository.findTaskById.mockResolvedValue(null);

      await expect(taskService.getTaskById('nonExistentId')).rejects.toThrow(ErrorHandler);
      await expect(taskService.getTaskById('nonExistentId')).rejects.toThrow('Tugas tidak ditemukan');
    });
  });

  describe('updateTaskById', () => {
    it('should update and return the task if found', async () => {
      const updateData = { status: 'Done' };
      const updatedTask = { _id: 'taskId123', title: 'Old Title', status: 'Done' };
      taskRepository.updateTaskById.mockResolvedValue(updatedTask);

      const result = await taskService.updateTaskById('taskId123', updateData);

      expect(result).toEqual(updatedTask);
      expect(taskRepository.updateTaskById).toHaveBeenCalledWith('taskId123', updateData);
    });

    it('should throw an ErrorHandler if task to update is not found', async () => {
      taskRepository.updateTaskById.mockResolvedValue(null);

      await expect(taskService.updateTaskById('nonExistentId', {})).rejects.toThrow(ErrorHandler);
    });
  });

  describe('deleteTaskById', () => {
    it('should return a success message if task is deleted successfully', async () => {
      const deletedTaskMock = { _id: 'taskId123', title: 'Task to be deleted' };
      taskRepository.deleteTaskById.mockResolvedValue(deletedTaskMock);

      const result = await taskService.deleteTaskById('taskId123');

      expect(result).toEqual({ message: 'Tugas berhasil dihapus' });
      expect(taskRepository.deleteTaskById).toHaveBeenCalledWith('taskId123');
    });

    it('should throw an ErrorHandler if task to delete is not found', async () => {
      taskRepository.deleteTaskById.mockResolvedValue(null);

      await expect(taskService.deleteTaskById('nonExistentId')).rejects.toThrow(ErrorHandler);
    });
  });
});