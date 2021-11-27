const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { notFoundErrorStatus, generalErrorStatus, invalidCredentialsErrorStatus } = require('../utils');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'c77b130afd3bf9cd159f21ede3c1673cc1ff764c5e37b0a0d675d13394f6e5e7',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { httpOnly: true }).send({ message: 'Вы успешно авторизованы' });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFoundErrorStatus).send({ message: 'Неправильные почта или пароль' });
        return;
      }
      if (err.name === 'IncorrectCredentials') {
        res.status(invalidCredentialsErrorStatus).send({ message: 'Неправильные почта или пароль' });
        return;
      }
      res.status(generalErrorStatus).send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};