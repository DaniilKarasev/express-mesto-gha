const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, 'SECRET');
    } catch (err) {
      return next(new UnauthorizedError('Ошибка авторизации'));
    }

    req.user = payload;

    next();
  } else {
    return next(new UnauthorizedError('Ошибка авторизации'));
  }
};
