const authService = require('../../services/auth.service');
const ErrorHandler = require('../../utils/errorHandler');

// Wrapper to handle async errors without needing try-catch in every method
const catchAsync = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

class AuthController {
  register = catchAsync(async (req, res, next) => {
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      message: 'Daftar akun berhasil',
      data: user,
    });
  });

  login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.loginUser(email, password);
    res.status(200).json({
      message: 'Login berhasil',
      data: {
        accessToken,
        refreshToken,
      },
    });
  });

  refresh = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ErrorHandler(401, 'Refresh token tidak ditemukan');
    }

    const { accessToken } = await authService.refreshToken(refreshToken);
    res.status(200).json({ accessToken });
  });
}

module.exports = new AuthController();
