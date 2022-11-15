const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const { linkValidation, idValidation } = require('../utils/validationRegex');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(linkValidation),
  }),
}), createCard);

router.delete('/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().regex(idValidation),
  }),
}), deleteCard);

router.put('/:id/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().regex(idValidation),
  }),
}), likeCard);

router.delete('/:id/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().regex(idValidation),
  }),
}), dislikeCard);

module.exports = router;
