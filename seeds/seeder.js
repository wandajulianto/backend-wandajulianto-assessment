const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../src/config');
const User = require('../src/models/user.model');
const Task = require('../src/models/task.model');

const seedData = async () => {
  try {
    await mongoose.connect(config.db.uri);
    console.log('MongoDB connected for seeding.');

    await User.deleteMany();
    await Task.deleteMany();
    console.log('Old data destroyed.');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const users = await User.insertMany([
      { username: 'admin', email: 'admin@example.com', password: adminPassword, role: 'Admin' },
      { username: 'user', email: 'user@example.com', password: userPassword, role: 'User' }
    ]);

    const adminId = users[0]._id;
    const userId = users[1]._id;

    await Task.insertMany([
      { title: 'Laporan Bulanan', description: 'Selesaikan laporan bulanan Q4.', status: 'In Progress', priority: 'High', assignedTo: adminId },
      { title: 'Update Website', description: 'Perbarui halaman "Tentang Kami".', status: 'To Do', priority: 'Medium', assignedTo: userId }
    ]);

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error}`);
    process.exit(1);
  }
};

seedData();