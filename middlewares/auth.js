const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    jwt.verify(token, process.env.JWT_KEY);
    next();
  } catch {
    res.redirect('/login');
  }
};
