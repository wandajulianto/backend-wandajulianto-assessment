const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const jwt = require('jsonwebtoken');
const config = require('../config');
const ErrorHandler = require('../utils/errorHandler');

class AuthService {
  async registerUser(userData) {
    const { email, password } = userData;

    // Check if user email already exists
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ErrorHandler(400, 'Email sudah terdaftar');
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
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ErrorHandler(400, 'Email atau password salah');
    }

    // Generate access token
    const accessToken = this.generateToken(user, config.jwt.secret, config.jwt.expiresIn);

    // Generate refresh token
    const refreshToken = this.generateToken(user, config.jwt.refreshSecret, config.jwt.refreshExpiresIn);

    // Save refresh token to database
    await userRepository.updateUserById(user._id, { refreshToken });

    return { accessToken, refreshToken };
  }

  // Create helper method to generate token
  generateToken(user, secret, expiresIn) {
    const payload = {
      id: user._id,
      role: user.role,
    };

    return jwt.sign(payload, secret, { expiresIn });
  }

  async refreshToken(token) {
    try {
      // 1. Verify token
      const decoded = jwt.verify(token, config.jwt.refreshSecret);
      const user = await userRepository.findUserById(decoded.id);

      // 2. Check if refresh token is valid
      if (!user || user.refreshToken !== token) {
        throw new ErrorHandler(400, 'Token tidak valid');
      }

      // 3. Generate new access token
      const accessToken = this.generateToken(user, config.jwt.secret, config.jwt.expiresIn);
      return { accessToken };
    } catch (error) {
      throw new ErrorHandler(400, 'Token tidak valid atau sudah kadaluarsa');
    }
  }
}

module.exports = new AuthService();
