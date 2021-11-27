const router = require('express').Router();
// eslint-disable-next-line object-curly-newline
const { getUsers, getUserId, updateProfile, updateAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserId);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
