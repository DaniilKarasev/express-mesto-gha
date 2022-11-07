/* eslint-disable no-console */
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
      console.log(err.message);
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
        console.log(err.message);
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
        console.log(err.message);
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
            .then(() => res.send({ message: 'Карточка удалена' }))
            .catch(() => next());
        } else {
          next(res.send({ message: 'Удаление возможно только владельцем карточки' }));
        }
      }
    })
    .catch((err) => {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
      console.log(err.message);
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
        next(res.status(404).send({ message: `Карточка с id: ${req.params.id} не найдена` }));
      }
    })
    .catch((err) => {
      res.status(400).send({ message: 'Ошибка на стороне сервера' });
      console.log(err.message);
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
        next(res.status(404).send({ message: `Карточка с id: ${req.params.id} не найдена` }));
      }
    })
    .catch((err) => {
      res.status(400).send({ message: 'Ошибка на стороне сервера' });
      console.log(err.message);
    });
};
