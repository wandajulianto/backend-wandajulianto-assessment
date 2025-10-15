require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const connectDB = require('./config/database');
const apiRoutes = require('./api/routes');
const errorHandler = require('./api/middlewares/error.middleware');

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware for parsing JSON body
app.use(express.json());

// Middleware for security
app.use(helmet())

// Middleware for rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests, please try again after 15 minutes.',
});

// Apply rate limiting middleware to API routes
app.use('/api', limiter);

// Serve uploaded files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Test
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is Healthy',
  });
});

// Main API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
