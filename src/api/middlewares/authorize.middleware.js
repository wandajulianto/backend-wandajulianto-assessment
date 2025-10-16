const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user set by 'protect' middleware before
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Anda tidak memiliki izin untuk mengakses resource ini',
      });
    }

    next();
  };
};

module.exports = authorize;
