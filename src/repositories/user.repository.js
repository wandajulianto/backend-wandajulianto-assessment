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

  async findUserById(id) {
    return await User.findById(id);
  }

  async updateUserById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = new UserRepository();
