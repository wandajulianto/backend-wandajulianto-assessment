const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./api/routes');
const errorHandler = require('./api/middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests, please try again after 15 minutes.',
});
app.use('/api', limiter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', apiRoutes);

app.use(errorHandler);

module.exports = app;