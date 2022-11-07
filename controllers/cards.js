/* eslint-disable no-console */
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      res.send(card);
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports.createCard = (req, res) => {
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
        res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card) {
        if (card.owner.toString() === req.user._id.toString()) {
          Card.findByIdAndRemove(req.params.id)
            .then(() => res.send({ message: 'Карточка удалена' }));
        } else {
          res.status(403).send({ message: 'Удаление возможно только владельцем карточки' });
        }
      } else {
        res.status(404).send({ message: `Карточка с id: ${req.params.id} не найдена` });
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

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(404).send({ message: `Карточка с id: ${req.params.id} не найдена` });
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(404).send({ message: `Карточка с id: ${req.params.id} не найдена` });
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
