/* eslint-disable no-console */
const Card = require('../models/card');
const {
  ServerError,
  NotFoundError,
  CastError,
  ForbiddenError,
} = require('../utils/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      res.send(card);
    })
    .catch(() => next(new ServerError('Ошибка на стороне сервера')));
};

module.exports.createCard = (req, res, next) => {
  const {
    name,
    link,
    owner = req.user._id,
  } = req.body;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastError(`Переданы некорректные данные при обновлении профиля. Поле${err.message.replace('card validation failed:', '').replace(':', '')}`));
      } else {
        next(new ServerError('Ошибка на стороне сервера'));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card) {
        if (card.owner.toString() === req.user._id.toString()) {
          Card.findByIdAndRemove(req.params.id)
            .then(() => res.send({ message: 'Карточка удалена' }));
        } else {
          next(new ForbiddenError('Удаление возможно только владельцем карточки'));
        }
      } else {
        next(new NotFoundError(`Карточка c id: ${req.params.id} не найдена`));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные при удалении карточки'));
      } else {
        next(new ServerError('Ошибка на стороне сервера'));
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        next(new NotFoundError(`Карточка c id: ${req.params.id} не найдена`));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Упс, что-то пошло не так!'));
      } else {
        next(new ServerError('Ошибка на стороне сервера'));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        next(new NotFoundError(`Карточка c id: ${req.params.id} не найдена`));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Упс, что-то пошло не так!'));
      } else {
        next(new ServerError('Ошибка на стороне сервера'));
      }
    });
};
