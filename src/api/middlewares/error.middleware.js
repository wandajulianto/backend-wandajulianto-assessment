const config = require('../../config');
const ErrorHandler = require('../../utils/errorHandler');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found. Invalid ID format for path: ${err.path}`;
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered for: ${Object.keys(
      err.keyValue
    )}`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: config.env === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;