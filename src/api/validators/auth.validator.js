const { body } = require('express-validator');

const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Tolong masukkan email yang valid')
    .normalizeEmail(),
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username harus memiliki minimal 3 karakter'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password harus memiliki minimal 6 karakter'),
];

module.exports = { registerValidator };
