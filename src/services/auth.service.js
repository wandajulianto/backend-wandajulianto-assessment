const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const jwt = require('jsonwebtoken');
const config = require('../config');

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

  async loginUser(email, password) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Email belum terdaftar');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Password salah');
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    };
  }
}

module.exports = new AuthService();
