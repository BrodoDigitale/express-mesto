const router = require('express').Router();
// eslint-disable-next-line object-curly-newline
const { getUsers, getUserId, updateProfile, updateAvatar, getCurrentUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserId);
router.get('/me', getCurrentUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
