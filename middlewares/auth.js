const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    res.status(403).send({ message: 'Необходима авторизация' });
    return;
  }

  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, 'c77b130afd3bf9cd159f21ede3c1673cc1ff764c5e37b0a0d675d13394f6e5e7');
  } catch (err) {
    res.status(401).send({ message: err.message });
    return;
  }
  req.user = payload;
  next();
};
