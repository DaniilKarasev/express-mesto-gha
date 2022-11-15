const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const { linkValidationPattern, idValidationPattern } = require('../utils/validationRegex');

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
    link: Joi.string().required().regex(linkValidationPattern),
  }),
}), createCard);

router.delete('/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().regex(idValidationPattern),
  }),
}), deleteCard);

router.put('/:id/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().regex(idValidationPattern),
  }),
}), likeCard);

router.delete('/:id/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().regex(idValidationPattern),
  }),
}), dislikeCard);

module.exports = router;
