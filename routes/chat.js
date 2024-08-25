const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');

router.get('/:id/:receiverid', chatController.getUserMessage);
router.post('/:id/:receiverid', chatController.postSendMessage);

// group chat
router.post('/group', chatController.postCreateGroupChat);
router.delete('/group/:id', chatController.deleteDeleteGroupChat);
router.put('/group/:id', chatController.putAddUserGroupChat);
router.delete('/group/:id', chatController.deleteRemoveUserGroupChat);
router.post('group/:id/message', chatController.postSendMessageGroupChat);

module.exports = router;
