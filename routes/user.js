const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');

const userController = require('../controllers/userController');

router.get('/', verifyToken, userController.getUsers);
router.get('/:id', verifyToken, userController.getUser);
router.put('/:id', verifyToken, userController.putUpdateUser);

router.put(
  '/:id/request',
  verifyToken,
  userController.putUpdateUserLastRequest
);

router.get('/:id/others', verifyToken, userController.getOthers);

router.post('/:id/friend', verifyToken, userController.postAddFriend);
router.delete('/:id/friend', verifyToken, userController.deleteRemoveFriend);

module.exports = router;
