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

module.exports = router;
