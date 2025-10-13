const jwt = require('jsonwebtoken');
const config = require('../../config');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header: Bearer <token>
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);

      // Set user in request object
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token tidak valid' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Token tidak ditemukan' });
  }
};

module.exports = protect;
