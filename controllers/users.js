const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { notFoundErrorStatus, generalErrorStatus, invalidDataErrorStatus } = require('../utils');

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail(new Error('Not found'))
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFoundErrorStatus).send({ message: 'Пользователи не найдены' });
        return;
      }
      res.status(generalErrorStatus).send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFoundErrorStatus).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(invalidDataErrorStatus).send({ message: 'Невалидный id' });
        return;
      }
      res.status(generalErrorStatus).send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFoundErrorStatus).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(invalidDataErrorStatus).send({ message: 'Невалидный id' });
        return;
      }
      res.status(generalErrorStatus).send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(invalidDataErrorStatus).send({ message: 'Введены некорректные данные' });
        return;
      }
      res.status(generalErrorStatus).send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail(new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFoundErrorStatus).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(invalidDataErrorStatus).send({ message: 'Введены некорректные данные' });
        return;
      }
      res.status(generalErrorStatus).send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFoundErrorStatus).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(invalidDataErrorStatus).send({ message: 'Введены некорректные данные' });
        return;
      }
      res.status(generalErrorStatus).send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};
