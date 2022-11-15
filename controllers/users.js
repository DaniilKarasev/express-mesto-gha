/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  ServerError,
  NotFoundError,
  CastError,
  ConflictError,
} = require('../utils/errors');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => next(new ServerError('Ошибка на стороне сервера')));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError(`Пользователь по указанному c id: ${req.params.cardId} не найден`));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Передан некорректный id пользователя'));
      } else {
        next(new ServerError('Ошибка на стороне сервера'));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    password,
    email,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name,
        about,
        avatar,
        password: hashedPassword,
        email,
      })
        .then((user) => {
          res.send(user);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new CastError(`Переданы некорректные данные при создании пользователя. Поле${err.message.replace('user validation failed:', '').replace(':', '')}`));
          }
          if (err.code === 11000) {
            next(new ConflictError(`Пользователь с email '${err.keyValue.email}' уже зарегистрирован`));
          }
          next(new ServerError('Произошла ошибка'));
        });
    })
    .catch(() => {
      next(new ServerError('Произошла ошибка'));
    });
};

module.exports.editUserProfile = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;

  User.findByIdAndUpdate(req.user._id, {
    name,
    about,
  }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new CastError('Передан некорректный id при обновлении профиля'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastError(`Переданы некорректные данные при обновлении профиля. Поле${err.message.replace('Validation failed:', '').replace(':', '')}`));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.editUserAvatar = (req, res, next) => {
  const {
    avatar,
  } = req.body;

  User.findByIdAndUpdate(req.user._id, {
    avatar,
  }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new CastError('Передан некорректный id при обновлении профиля'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastError(`Переданы некорректные данные при обновлении профиля. Поле${err.message.replace('Validation failed:', '').replace(':', '')}`));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({
        _id: user._id,
      }, 'SECRET');

      res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
        sameSite: true,
      });

      res.send({ data: user.toJSON() });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (user) {
        res.send(user);
      }
      next(new NotFoundError(`Пользователь по указанному c id: ${req.params.id} не найден`));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Передан некорректный id пользователя'));
      }
      next(new ServerError('Произошла ошибка'));
    });
};
