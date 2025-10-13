const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');

class AuthService {
  async registerUser(userData) {
    const { email, password } = userData;

    // Check if user email already exists
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email sudah terdaftar');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    // Delete password from returned object
    newUser.password = undefined;

    return newUser;
  }
}

module.exports = new AuthService();
