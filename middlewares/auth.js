const jwt = require('jsonwebtoken');
const { invalidCredentialsErrorStatus, AccessDeniedErrorStatus } = require('../utils');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(AccessDeniedErrorStatus).send({ message: 'Необходима авторизация' });
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'c77b130afd3bf9cd159f21ede3c1673cc1ff764c5e37b0a0d675d13394f6e5e7');
  } catch (err) {
    res.status(invalidCredentialsErrorStatus).send({ message: 'Ошибка авторизации' });
    return;
  }
  req.user = payload;
  next();
};
