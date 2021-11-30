const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const InvalidCredentialsError = require('../errors/invalid-credentials-err');
const NotFoundError = require('../errors/not-found-err');

// Схема пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        return /https?:\/\/[\w-]+.[a-z.]+[/*[a-z#]+]?/gim.test(url);
      },
      message: 'Поле avatar не является ссылкой',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неверно указан email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
// метод модели пользователя для поиска по емейлу и паролю
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new InvalidCredentialsError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

// создание модели пользователя и экспорт
module.exports = mongoose.model('user', userSchema);
