const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

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
    cardId: Joi.string().alphanum().length(24),
  }),
}), getUserId);
router.patch('/me', celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/https?:\/\/[\w-]+.[a-z.]+[/*[a-z#]+]?'/im),
      about: Joi.string().min(2).max(30),
    }),
  },
), updateProfile);
router.patch('/me/avatar', celebrate(
  {
    body: Joi.object().keys({
      avatar: Joi.string().pattern(/https?:\/\/[\w-]+.[a-z.]+[/*[a-z#]+]?'/im),
    }),
  },
), updateAvatar);

module.exports = router;
