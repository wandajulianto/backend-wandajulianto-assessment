const User = require('../models/user.model');

class UserRepository {
  async createUser(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }
}

module.exports = new UserRepository();
