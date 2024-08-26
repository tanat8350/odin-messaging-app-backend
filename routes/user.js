const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.putUpdateUser);

router.put('/:id/request', userController.putUpdateUserLastRequest);

router.get('/:id/others', userController.getOthers);

router.post('/:id/friend', userController.postAddFriend);
router.delete('/:id/friend', userController.deleteRemoveFriend);

router.get('/:id/:recipientid', userController.getUserMessage);
router.post('/:id/:recipientid', userController.postSendMessage);

module.exports = router;
