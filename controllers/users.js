/* eslint-disable no-console */
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: `Пользователь по указанному c id: ${req.params.id} не найден` });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Упс, что-то пошло не так!' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.editUserProfile = (req, res) => {
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
        res.status(404).send({ message: `Пользователь по указанному c id: ${req.user._id} не найден` });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  const {
    avatar,
  } = req.body;

  User.findByIdAndUpdate(req.user._id, {
    avatar,
  }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Пользователь по указанному c id: ${req.user._id} не найден` });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные аватара' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};
