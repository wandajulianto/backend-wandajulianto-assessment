const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const Task = require('../../src/models/task.model');
const bcrypt = require('bcryptjs');

describe('Task API Endpoints ', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
    };
    
    const user = await new User(userData).save();
    userId = user._id;

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    token = res.body.data.accessToken;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task when authenticated', async () => {
      const taskData = {
        title: 'Integration Test Task',
        description: 'Testing the creation endpoint.',
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe(taskData.title);
      expect(res.body.data.assignedTo.toString()).toBe(userId.toString());

      const taskInDb = await Task.findById(res.body.data._id);
      expect(taskInDb).not.toBeNull();
      expect(taskInDb.title).toBe(taskData.title);
    });

    it('should return 401 Unauthorized if no token is provided', async () => {
      const taskData = { title: 'No Auth Task' };

      const res = await request(app).post('/api/tasks').send(taskData);
      
      expect(res.statusCode).toEqual(401);
    });

    it('should return 400 Bad Request if task data is invalid', async () => {
      const invalidTaskData = { title: '' };

      const res = await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send(invalidTaskData);

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/tasks', () => {
    it('should return a list of tasks when authenticated', async () => {
      await new Task({ title: 'Task 1', assignedTo: userId }).save();
      await new Task({ title: 'Task 2', assignedTo: userId }).save();

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.tasks).toBeInstanceOf(Array);
      expect(res.body.tasks.length).toBe(2);
    });
  });
});