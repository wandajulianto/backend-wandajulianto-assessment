const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validator.middleware');
const { registerValidator } = require('../validators/auth.validator');
const router = express.Router();

router.post(
  '/register',
  registerValidator, // 1. Run validator
  validate, // 2. Check validation result
  authController.register // 3. If validation is successful, call the controller
);

router.post('/login', authController.login);

// Test middleware
const protect = require('../middlewares/auth.middleware');
router.get('/me', protect, (req, res) => {
  res.status(200).json({ message: 'Berhasil mengakses route ini', user: req.user });
})

module.exports = router;
