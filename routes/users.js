const router = require('express').Router();

const {
  getUsers,
  createUser,
  getUserById,
  editUserProfile,
  editUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.patch('/me', editUserProfile);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
