const express = require('express');
const userController = require('../controllers/user.controller');
const protect = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const router = express.Router();

// GET /api/users
// This route is protected and only accessible by Admin/Manager
router.get(
  '/',
  protect,
  authorize('Admin', 'Manager'),
  userController.getAllUsers,
);

module.exports = router;
