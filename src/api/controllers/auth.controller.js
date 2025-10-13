const authService = require('../../services/auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.registerUser(req.body);
      res.status(201).json({
        message: 'Daftar akun berhasil',
        data: user,
      });
    } catch (error) {
      // TODO: Handle error
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
