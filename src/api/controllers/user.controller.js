const User = require('../../models/user.model');

class UserController {
  async getAllUsers(req, res, next) {
    // Logic to get all users placed in service/repository later
    // For now, just return a sample response
    res.status(200).json({
      message: 'Sukses mendapatkan semua user (hanyaAdmin/Manager)',
      // data: users,
    });
  }
}

module.exports = new UserController();
