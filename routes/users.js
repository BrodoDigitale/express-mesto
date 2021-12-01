const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validator } = require('validator');

const {
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUserId);
router.patch('/me', celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  },
), updateProfile);
router.patch('/me/avatar', celebrate(
  {
    body: Joi.object().keys({
      avatar: Joi.string().custom((value) => {
        validator.isURL(value, { require_protocol: true });
      }),
    }),
  },
), updateAvatar);

module.exports = router;
