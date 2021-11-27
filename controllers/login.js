const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { notFoundErrorStatus, generalErrorStatus, invalidCredentialsErrorStatus } = require('../utils');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .orFail(new Error('Not found'))
    .then((user) => { bcrypt.compare(password, user.password); })
    .then((matched, user) => {
      if (!matched) {
        Promise.reject(new Error('IncorrectCredentials'));
      }
      const token = jwt.sign(
        { _id: user._id },
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { httpOnly: true }).send();
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
