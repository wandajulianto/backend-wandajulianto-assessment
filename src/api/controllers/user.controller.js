const User = require('../../models/user.model');

// Wrapper to handle async errors without needing try-catch in every method
const catchAsync = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

class UserController {
  getAllUsers = catchAsync(async (req, res, next) => {
    // Logic to get all users placed in service/repository later
    // For now, just return a sample response
    res.status(200).json({
      message: 'Sukses mendapatkan semua user (hanyaAdmin/Manager)',
      // data: users,
    });
  });
}

module.exports = new UserController();
