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
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    res.status(invalidCredentialsErrorStatus).send({ message: 'Ошибка авторизации' });
    return;
  }
  req.user = payload;
  next();
};
