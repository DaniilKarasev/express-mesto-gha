const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const { linkValidation, idValidation } = require('../utils/validationRegex');

const {
  getUsers,
  getCurrentUserInfo,
  editUserProfile,
  editUserAvatar,
  getUserById,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUserInfo);

router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), editUserProfile);

router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().regex(linkValidation),
  }),
}), editUserAvatar);

router.get('/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().regex(idValidation),
  }),
}), getUserById);

module.exports = router;
