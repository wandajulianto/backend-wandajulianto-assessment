require('dotenv').config();
const express = require('express');
const config = require('./config');
const connectDB = require('./config/database');
const apiRoutes = require('./api/routes');

const app = express();

// Middleware for parsing JSON body
app.use(express.json());

// Test
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is Healthy',
  });
});

// Main API routes
app.use('/api', apiRoutes);

// Connect to MongoDB
connectDB();

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
