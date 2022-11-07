/* eslint-disable no-console */
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
      console.log(err.message);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.send(user);
      }
      next(res.status(404).send({ message: `Пользователь по указанному c id: ${req.params.id} не найден` }));
    })
    .catch((err) => {
      res.status(400).send({ message: 'Ошибка на стороне сервера' });
      console.log(err.message);
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
        console.log(err.message);
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
        console.log(err.message);
      }
    });
};

module.exports.editUserProfile = (req, res, next) => {
  const {
    name,
    about,
    owner = req.user._id,
  } = req.body;
  User.findById(owner)
    .then((userFound) => {
      if (!userFound) {
        next(res.status(404).send({ message: `Пользователь по указанному c id: ${req.params.id} не найден` }));
      }
      User.findByIdAndUpdate(owner, {
        name,
        about,
      }, { new: true, runValidators: true })
        .then((user) => {
          res.send(user);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
            console.log(err.message);
          } else {
            res.status(500).send({ message: 'Ошибка на стороне сервера' });
            console.log(err.message);
          }
        });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
      console.log(err.message);
    });
};

module.exports.editUserAvatar = (req, res, next) => {
  const {
    avatar,
    owner = req.user._id,
  } = req.body;
  User.findById(owner)
    .then((userFound) => {
      if (!userFound) {
        next(res.status(404).send({ message: `Пользователь по указанному c id: ${req.params.id} не найден` }));
      }
      User.findByIdAndUpdate(owner, {
        avatar,
      }, { new: true, runValidators: true })
        .then((user) => {
          res.send(user);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
            console.log(err.message);
          } else {
            res.status(500).send({ message: 'Ошибка на стороне сервера' });
            console.log(err.message);
          }
        });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
      console.log(err.message);
    });
};
