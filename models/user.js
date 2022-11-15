/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const { UnauthorizedError, ServerError } = require('../utils/errors');
const { linkValidation } = require('../utils/validationRegex');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Введите адресс электронной почты');
      }
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  return {
    _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
  };
};

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user;
        });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        Promise.reject(new UnauthorizedError(err.message));
      }
      Promise.reject(new ServerError('Произошла ошибка'));
    });
};

const avatarValidator = function (value) {
  return linkValidation.test(value);
};

userSchema.path('avatar').validate(avatarValidator, 'error');

module.exports = mongoose.model('user', userSchema);
